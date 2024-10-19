import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../firebase.config';
import Modal from './Modal'; // Assume you have a custom Modal component
import { FaSearch } from 'react-icons/fa';

export default function UserBuyers() {
    const [buyers, setBuyers] = useState([]);
    const [selectedBuyer, setSelectedBuyer] = useState(null); // For modal
    const [showModal, setShowModal] = useState(false);
    const [orderDetails, setOrderDetails] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [vendors, setVendors] = useState([]);
    const [buyerVendorImages, setBuyerVendorImages] = useState({});


    // Fetch buyers from Firestore
    useEffect(() => {
        const fetchBuyers = async () => {
            const buyersQuery = query(collection(db, 'users'), where('userType', '==', 'buyer'));
            const querySnapshot = await getDocs(buyersQuery);
            const buyersList = [];
            querySnapshot.forEach((doc) => {
                buyersList.push({ id: doc.id, ...doc.data() });
            });
            setBuyers(buyersList);
        };
        fetchBuyers();
    }, []);

    // Open modal and fetch order details for the selected buyer
    const openModal = async (buyer) => {
        setSelectedBuyer(buyer);
        const ordersQuery = query(collection(db, 'orders'), where('buyerId', '==', buyer.id));
        const querySnapshot = await getDocs(ordersQuery);
        const ordersList = [];
        querySnapshot.forEach((doc) => {
            ordersList.push({ id: doc.id, ...doc.data() });
        });
        setOrderDetails(ordersList);
    };

    // Fetch vendor images related to the buyer's orders
   // Fetch vendor images specific to the selected buyer
const fetchVendorImages = async (buyerId) => {
    const q = query(collection(db, 'orders'), where('buyerId', '==', buyerId));
    const querySnapshot = await getDocs(q);

    // Create a map to store vendor images specific to the buyer's orders
    const vendorImages = querySnapshot.docs.map((doc) => doc.data().vendorProfileImage);

    // If no vendor images found for this buyer
    if (vendorImages.length === 0) {
        console.log('No orders or vendor images for this buyer');
    }

    return vendorImages;
};


    // Handle when a buyer is clicked (fetch vendor images and open modal)
    const handleBuyerClick = async (buyer) => {
        setSelectedBuyer(buyer);
        
        // Fetch vendor images specific to this buyer
        const vendorImages = await fetchVendorImages(buyer.id);
    
        // Update the state with the vendor images for the selected buyer
        setBuyerVendorImages((prevState) => ({
            ...prevState,
            [buyer.id]: vendorImages, // Store vendor images specific to this buyer
        }));
    
        openModal(buyer); // Fetch order details when opening the modal
        setShowModal(true);
    };
    
    // Handle verification
    const handleVerify = async (buyerId) => {
        await updateDoc(doc(db, 'users', buyerId), { status: 'verified' });
        alert('User verified!');
    };

    // Handle rejection
    const handleReject = async (buyerId) => {
        await updateDoc(doc(db, 'users', buyerId), { status: 'rejected' });
        alert('User rejected.');
    };

    // Search buyers
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredBuyers = buyers.filter(buyer =>
        buyer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );




    return (
        <div className="h-screen bg-gray-900  dark:bg-gray-700">

<div className="relative bg-cover bg-center shadow py-10 w-[100%]"
          style={{ backgroundImage: "url('https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/a1/3e/82/chinese-mix.jpg?w=600&h=-1&s=1')" }}>
          <h1 className="text-3xl font-bold mb-1 text-center text-white">All Buyers</h1>
          <div className="mb-9 flex justify-center">
          </div>
             {/* Search Section */}
             <div className="flex justify-center mb-4 mx-10">
                <div className="flex items-center bg-white w-full dark:bg-gray-900 rounded-lg shadow-md px-4 py-2">
                    <FaSearch className="text-gray-600 dark:text-gray-300 mr-2" />
                    <input
                        type="text"
                        placeholder="Search buyers..."
                        className="bg-transparent outline-none"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            
          </div>
        </div>

           

            {/* Buyer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mx-2">
                {filteredBuyers.map((buyer) => (
                    <div key={buyer.id}   class=" dark:bg-gray-700 bg-gray-900 pt-12">

                        <div class="max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                            <div class="border-b px-4 pb-6">
                                <div class="text-center my-4">
                                    <img class="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4"
                                        src={buyer.profileImage || "https://randomuser.me/api/portraits/women/21.jpg"} alt="profile"/>
                                    <div class="py-2">
                                        <h3 class="font-bold text-2xl text-gray-800 dark:text-white mb-1">{buyer.fullName}</h3>
                                        <div class="inline-flex text-gray-700 dark:text-gray-300 items-center">
                                            <svg class="h-5 w-5 text-gray-400 dark:text-gray-600 mr-1" fill="currentColor"
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                                <path class=""
                                                    d="M5.64 16.36a9 9 0 1 1 12.72 0l-5.65 5.66a1 1 0 0 1-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 1 0-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                                            </svg>
                                            {buyer.location}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex gap-2 px-2">
                                    <button
                                        class="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white dark:text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2"
                                        onClick={() => handleVerify(buyer.id)}
                                        >
                                            Verify
                                    </button>
                                    <button
                                        class="flex-1 rounded-full border-2 border-gray-400 dark:border-gray-700 font-semibold text-black dark:text-white px-4 py-2"
                                        onClick={() => handleReject(buyer.id)}
                                >
                                    Reject
                                    </button>
                                </div>
                            </div>
                            <div class="px-4 py-4">
                                
                                <div class="flex">
                                <div className="flex justify-end mr-2">
    
</div>
{/*}
                                    <button onClick={() => handleBuyerClick(buyer)} className="bg-gray-300 p-2 mt-2 rounded">
                                        View Orders
                                    </button>
                */}
                                    </div>
                                </div>
                            </div>
                        </div>
                
                
                ))}
            </div>

            {selectedBuyer && (
    <Modal onClose={() => setSelectedBuyer(null)}>
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center border-b pb-4">
                Order Details for {selectedBuyer.fullName}
            </h2>

            {/* Order Details List */}
            <div className="overflow-y-scroll max-h-64 space-y-4">
                {orderDetails.map((order) => (
                    <div
                        key={order.id}
                        className="flex items-center bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out"
                    >
                        {/* Food Image */}
                        <img
                            src={order.image || "https://via.placeholder.com/100"}
                            alt={order.name}
                            className="w-16 h-16 rounded-full object-cover mr-4"
                        />

                        {/* Food and Vendor Details */}
                        <div className="flex-grow">
                            <p className="text-lg font-semibold text-gray-800">{order.name}</p>
                            <p className="text-sm text-gray-600">
                                <strong>Price:</strong> ${order.price}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Vendor:</strong> {order.vendorName}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Status:</strong> {order.status}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </Modal>
)}

        </div>
    );
}
