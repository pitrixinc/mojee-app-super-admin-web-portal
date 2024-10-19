import { useEffect, useState } from 'react';
import { collection, doc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase.config';
import Modal from './Modal'; // Assume you have a custom Modal component
import { deleteUser, getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { toast } from 'react-toastify';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [superAdminId, setSuperAdminId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState('All Users');
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersList);
      setFilteredUsers(usersList);
    };

    const fetchVerificationRequests = async () => {
      const querySnapshot = await getDocs(collection(db, 'applyVerification'));
      const requestsList = [];
      querySnapshot.forEach((doc) => {
        requestsList.push({ id: doc.id, ...doc.data() });
      });
      setVerificationRequests(requestsList);
    };

    fetchUsers();
    fetchVerificationRequests();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users, verificationRequests, selectedTab]);

  const filterUsers = () => {
    let filtered = users.filter(user =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
/*
    if (selectedTab === 'Creators Who Applied For Verification') {
      filtered = filtered.filter(user =>
        verificationRequests.some(request => user.isCreator && request.addedBy === user.uid)
      );
    } else if (selectedTab === 'Donators Who Applied For Verification') {
      filtered = filtered.filter(user =>
        verificationRequests.some(request => user.isDonor && request.addedBy === user.uid)
      );
    } else if (selectedTab === 'Pending Creators') {
      filtered = filtered.filter(user =>
        verificationRequests.some(request => user.isCreator && request.addedBy === user.uid && request.status === 'Pending')
      );
    } else if (selectedTab === 'Verified Creators') {
      filtered = filtered.filter(user =>
        verificationRequests.some(request => user.isCreator && request.addedBy === user.uid && request.status === 'Verified')
      );
    } else if (selectedTab === 'Rejected Creators') {
      filtered = filtered.filter(user =>
        verificationRequests.some(request => user.isCreator && request.addedBy === user.uid && request.status === 'Rejected')
      );
    } else if (selectedTab === 'Pending Donators') {
      filtered = filtered.filter(user =>
        verificationRequests.some(request => user.isDonor && request.addedBy === user.uid && request.status === 'Pending')
      );
    } else if (selectedTab === 'Verified Donators') {
      filtered = filtered.filter(user =>
        verificationRequests.some(request => user.isDonor && request.addedBy === user.uid && request.status === 'Verified')
      );
    } else if (selectedTab === 'Rejected Donators') {
      filtered = filtered.filter(user =>
        verificationRequests.some(request => user.isDonor && request.addedBy === user.uid && request.status === 'Rejected')
      );
    }
    */
    if (selectedTab === 'Vendors') {
      filtered = filtered.filter(user => user.userType === 'vendor');
    } else if (selectedTab === 'Buyers') {
      filtered = filtered.filter(user => user.userType === 'buyer');
    } else if (selectedTab === 'Super Admins') {
      filtered = filtered.filter(user => user.isSuperAdmin);
    }


    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    let request = null;
    
    if (user.isCreator || user.isDonor) {
        request = verificationRequests.find(request => request.addedBy === user.uid);
    }

    setSelectedRequest(request || null);  // This sets the request if found, or null if not.
    setSelectedUser(user);
    setIsEditModalOpen(true);
};


  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateRequest = async () => {
    if (selectedRequest) {
      const requestRef = doc(db, 'applyVerification', selectedRequest.id);
      await updateDoc(requestRef, selectedRequest);
    }
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setSelectedRequest(null);
    toast.success('User has been updated successfully')
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      if (selectedUser.isSuperAdmin) {
        alert("Super Admin cannot be deleted!");
        return;
      }
      try {
        await deleteDoc(doc(db, 'users', selectedUser.id));
        const userAuth = auth.currentUser;
        if (userAuth && userAuth.uid === selectedUser.uid) {
          await deleteUser(userAuth);
        }
        setUsers(users.filter(user => user.id !== selectedUser.id));
        setFilteredUsers(filteredUsers.filter(user => user.id !== selectedUser.id));
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        toast.success('You successfully deleted the user')
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className="container px-4 mx-auto bg-gray-900 dark:text-gray-300">
      <div className="relative bg-cover bg-center shadow py-10 w-[100%]"
          style={{ backgroundImage: "url('https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/a1/3e/82/chinese-mix.jpg?w=600&h=-1&s=1')" }}>
          <h1 className="text-3xl font-bold mb- text-center text-white">All Users</h1>
           <h6 className='"text-xl font-bold mb-8 text-center text-white'>{users.length} users</h6>
          <div className="mb-8 flex justify-center">
            
          </div>
        </div>
      
      <div className="flex mt-6 gap-x-4 w-full overflow-x-auto no-scrollbar">
        {['All Users'].map(tab => (
          <button
            key={tab}
            className={`px-3 py-1.5 whitespace-nowrap ${selectedTab === tab ? 'text-blue-600 bg-blue-100' : 'text-gray-600 bg-gray-100'} rounded-full`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex flex-col mt-6">
   
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y text-white divide-gray-700">
                <thead className="text-white bg-gray-800">
                  <tr>
                    <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-white">
                      <div className="flex items-center gap-x-3">
                        <input type="checkbox" className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700" />
                        <span>Name</span>
                      </div>
                    </th>
                    <th scope="col" className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-white">
                      <button className="flex items-center gap-x-2">
                        <span>Status</span>
                      </button>
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-white">
                      <button className="flex items-center gap-x-2">
                        <span>Role</span>
                      </button>
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-white">Email address</th>
                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-white">Actions</th>
                   
                  </tr>
                </thead>
                <tbody className="text-white divide-y divide-gray-200 dark:divide-gray-700bg-gray-700">
                  {currentUsers.map(user => (
                    <tr key={user.id}>
                      <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                        <div className="inline-flex items-center gap-x-3">
                          <input type="checkbox" className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700" />
                          <div className="flex items-center gap-x-2">
                            <img className="object-cover w-10 h-10 rounded-full" src={user.profileImage || 'default-image-url'} alt="" />
                            <div>
                              <h2 className="font-medium text-white dark:text-white">{user.fullName}</h2>
                              <p className="text-sm font-normal text-white">{user.email}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                        <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                          <span className={`h-1.5 w-1.5 rounded-full bg-emerald-600`}></span>
                          <h2 className="text-sm font-normal text-white">Active</h2>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-white whitespace-nowrap">{user.userType === 'buyer' ? ('Buyer') : user.userType === 'vendor' ? ('Vendor') : user.isMiniAdmin ? 'Mini Admin' : user.isSuperAdmin ? 'Super Admin' : 'None'} </td>
                      <td className="px-4 py-4 text-sm text-white whitespace-nowrap">{user.email}</td>
                 
                      <td class="px-4 py-4 text-sm whitespace-nowrap">
                                    <div class="flex items-center gap-x-6">
                                    {user.id === superAdminId ? (
                                        <button class="transition-colors duration-200 dark:hover:text-red-500 text-white hover:text-red-500 focus:outline-none">
                                         <svg
                                        viewBox="0 0 1024 1024"
                                        fill="currentColor"
                                        height="1em"
                                        width="1em"
                                        class="w-5 h-5"
                                        >
                                        <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z" />
                                        </svg>
                                       </button> ) : (
                                        <button onClick={() => handleDelete(user)} class="text-white transition-colors duration-200 dark:hover:text-red-500  hover:text-red-500 focus:outline-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button> )}

                                    </div>
                                </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={handlePreviousPage}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to <span className="font-medium">{indexOfLastUser}</span> of <span className="font-medium">{filteredUsers.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={handlePreviousPage}
                        className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Previous</span>
                        &laquo;
                      </button>
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => handlePageClick(index + 1)}
                          className={`relative inline-flex items-center border ${currentPage === index + 1 ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'} px-4 py-2 text-sm font-medium`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={handleNextPage}
                        className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Next</span>
                        &raquo;
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

{isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-500 dark:text-black">
            <h2 className="text-xl font-bold mb-4">Delete User</h2>
            <p>Are you sure you want to delete this user?</p>
            <button
              onClick={handleDeleteUser}
              className="mr-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Confirm
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Users;
