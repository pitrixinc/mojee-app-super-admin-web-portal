import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import Modal from './Modal'; // Assuming you have a custom Modal component
import { FaSearch } from 'react-icons/fa'; // Importing search icon
import { toast } from 'react-toastify';

const SuperAdminDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const vendorsData = usersSnapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .filter(user => user.userType === 'vendor');
      setVendors(vendorsData);
    };

    fetchVendors();
  }, []);

  const handleVerify = async (vendorId) => {
    const vendorRef = doc(db, 'users', vendorId);
    await updateDoc(vendorRef, { status: 'verified' });
    toast.success('Vendor Verified');
    setVendors(vendors.map(v => v.id === vendorId ? { ...v, status: 'verified' } : v));
  };

  const handleReject = async (vendorId) => {
    const vendorRef = doc(db, 'users', vendorId);
    await updateDoc(vendorRef, { status: 'rejected' });
    toast.error('Vendor Rejected');
    setVendors(vendors.map(v => v.id === vendorId ? { ...v, status: 'rejected' } : v));
  };

  const handleVendorClick = (vendor) => {
    setSelectedVendor(vendor);
    setShowModal(true);
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      
      <div className="relative bg-cover bg-center shadow py-10 w-[100%]"
          style={{ backgroundImage: "url('https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/a1/3e/82/chinese-mix.jpg?w=600&h=-1&s=1')" }}>
          <h1 className="text-3xl font-bold mb-1 text-center text-white">All Vendors</h1>
          <div className="mb-9 flex justify-center">
          </div>
             {/* Search Section */}
             <div className="relative mb-6 mx-10">
              <FaSearch className="absolute top-3 left-4 text-gray-500" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Search for a vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
        </div>

      <div className="max-w-7xl mx-auto mt-8">
        

        {/* Vendor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-lg shadow-md p-6 text-center">
              <img
                src={vendor.profileImage}
                alt="Vendor Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{vendor.fullName}</h3>
              <p className="text-gray-600 mb-4">{vendor.location}</p>
              <div className="space-x-2">
                <button
                  onClick={() => handleVerify(vendor.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleReject(vendor.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Reject
                </button>
              {/*  <button
                  onClick={() => handleVendorClick(vendor)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  View Details
          </button> */}
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Vendor Details */}
        {showModal && selectedVendor && (
          <Modal onClose={() => setShowModal(false)}>
            <div className="p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">{selectedVendor.fullName}'s Foods</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <VendorFoods vendorId={selectedVendor.id} />
              </div>
              <h2 className="text-2xl font-bold mt-6 mb-4">{selectedVendor.fullName}'s Orders</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <VendorOrders vendorId={selectedVendor.id} />
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

// Vendor Foods Component (Styled with Tailwind CSS)
const VendorFoods = ({ vendorId }) => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      const foodsCollection = collection(db, 'foods');
      const foodsSnapshot = await getDocs(foodsCollection);
      const foodsData = foodsSnapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .filter(food => food.vendorId === vendorId);
      setFoods(foodsData);
    };

    fetchFoods();
  }, [vendorId]);

  return (
    <>
      {foods.map(food => (
        <div key={food.id} className="bg-white rounded-lg shadow-md p-4">
          <img src={food.imageUrl} alt="Food" className="w-full h-40 object-cover rounded-md mb-4" />
          <h3 className="text-lg font-semibold">{food.name}</h3>
          <p className="text-gray-600 text-sm">{food.description.slice(0,20)}...</p>
          <p className="text-gray-800 font-bold mt-2">GHS{food.price}</p>
          <p className="text-sm text-gray-500">
            Created At: {food.createdAt}
          </p>
        </div>
      ))}
    </>
  );
};

// Vendor Orders Component (Styled with Tailwind CSS)
const VendorOrders = ({ vendorId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersData = ordersSnapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .filter(order => order.vendorId === vendorId);
      setOrders(ordersData);
    };

    fetchOrders();
  }, [vendorId]);

  return (
    <>
      {orders.map(order => (
        <div key={order.id} className="bg-white rounded-lg shadow-md p-4">
          <img src={order.buyerProfileImage} alt="Buyer" className="w-12 h-12 rounded-full mb-2" />
          <h3 className="text-lg font-semibold">{order.name}</h3>
          <p className="text-gray-600">Price: GHS{order.price}</p>
          <p className="text-gray-800">Status: {order.status}</p>
          <p className="text-sm text-gray-500">
            Order Date: {order.createdAt}
          </p>
        </div>
      ))}
    </>
  );
};

export default SuperAdminDashboard;
