import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../firebase.config';
import { toast } from 'react-toastify';

const Sidebar = () => {
    const router = useRouter()
    const { id } = router.query;
    const [userDetails, setUserDetails] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showSettingModal, setShowSettingModal] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
          if (id) {
            try {
              const userDocRef = doc(db, 'users', id);
              const userDocSnapshot = await getDoc(userDocRef);
      
              if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                setUserDetails(userData);
                console.log('User Details:', userData);
      
               // Check user type and redirect accordingly
                if (!userData.isSuperAdmin  && userData.isMiniAdmin) {
                    // User is not a creator or donor but is a mini admin, redirect to /dashboard
                    router.push(`/dashboard/${id}/dashboard`);
                } // Check user type and redirect accordingly
               else if (!userData.isSuperAdmin  && userData.isCreator) {
                    // User is not a creator or donor but is a mini admin, redirect to /dashboard
                    router.push(`/account/${id}/dashboard`);
                } else if (!userData.isSuperAdmin && userData.isDonor) {
                    // User is not a customer but is a super admin, redirect to /my-admin
                    router.push(`/account/${id}/dashboard`);
                } else {
                    // User is a customer or user type not recognized, continue rendering the page
                }
              } else {
                console.log('User not found');
                router.push('/signin');
              }
            } catch (error) {
              console.error('Error fetching user data', error);
            }
          }
        };
      
        console.log('UID:', id); // Log UID to check if it's defined
      
        fetchUserData();
      }, [id, router]);

      const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success('You logged out successfully')
            router.push('/signin');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

  return (
    <>
    <aside className='dark:bg-gray-900 text-white dark:text-white hidden sm:flex flex-col w-[20%] overflow-y-auto items-center xl:items-start xl:w-[340px] p-2 fixed h-full border-r border-gray-400 pr-0 xl:pr-8 no-scrollbar'>
    <a href="#">
              <img className="w-auto h-10 sm:h-10" src="/images/logo.jpg" alt="Logo" /> 
            </a>

    <div class="flex flex-col justify-between flex-1 mt-6">
        <nav class="flex-1 -mx-3 space-y-3 p-2">
            {/* 
            <div class="relative mx-3">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </span>

                <input type="text" class="w-full py-1.5 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring" placeholder="Search" />
            </div>
            */}

            <div onClick={() => router.push(`/my-admin/${id}/dashboard`)} class="flex items-center px-3 py-2 text-white transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>

                <span class="mx-2 text-sm font-medium">Dashboard</span>
            </div>
{/*
            <div onClick={() => router.push(`/my-admin/${id}/profile`)} class="cursor-pointer flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                </svg>

                <span class="mx-2 text-sm font-medium">Profile</span>
            </div>
        */}
            <div onClick={() => router.push(`/my-admin/${id}/buyers`)} class="cursor-pointer flex items-center px-3 py-2 text-white transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>

                <span class="mx-2 text-sm font-medium">Buyers Management</span>
            </div>

            <div onClick={() => router.push(`/my-admin/${id}/vendors`)} class="cursor-pointer flex items-center px-3 py-2 text-white transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>

                <span class="mx-2 text-sm font-medium">Vendors Management</span>
            </div>
{/*
            <div onClick={() => router.push(`/my-admim/${id}/projects/donations`)} class="cursor-pointer flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
                </svg>

                <span class="mx-2 text-sm font-medium">Donation Management</span>
            </div>
        */}
            <div onClick={() => router.push(`/my-admin/${id}/users`)} class="cursor-pointer flex items-center px-3 py-2 text-white transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>

                <span class="mx-2 text-sm font-medium">All Users</span>
            </div>
           
            <div onClick={() => setShowSettingModal(true)} class="cursor-pointer flex items-center px-3 py-2 text-white transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>

                <span class="mx-2 text-sm font-medium">Setting</span>
            </div>
        </nav>

        
    </div>
</aside>

<div className='dark:bg-gray-900 dark:text-gray-300 text-white fixed bottom-0 left-0 z-10 w-full md:hidden lg:hidden bg-gray-700 border-t border-gray-400 p-4 flex justify-between'>
  <button onClick={() => router.push(`/my-admin/${id}/dashboard`)}>
    <div className='flex items-center justify-center'>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 " fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    </div>
    <span className="btm-nav-label text-sm">Home</span>
  </button>
  
  <button onClick={() => router.push(`/my-admin/${id}/buyers`)}>
  <div className='flex items-center justify-center'>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  </div> 
  <span className="btm-nav-label text-sm">Buyers</span>
  </button>

  <button onClick={() => router.push(`/my-admin/${id}/vendors`)}>
  <div className='flex items-center justify-center'>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  </div> 
  <span className="btm-nav-label text-sm">Vendors</span>
  </button>

  <button className="active" onClick={() => router.push(`/my-admin/${id}/users`)}>
  <div className='flex items-center justify-center'>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  </div>  
  <span className="btm-nav-label text-sm">Users</span>
  </button>

  <button className="active" onClick={() => setShowSettingModal(true)}>
  <div className='flex items-center justify-center'>
  <img class="object-cover rounded-full h-7 w-7" src={userDetails?.profileImage} alt="avatar" />
 </div>  
  </button>
</div>


{showLogoutModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-500 dark:text-black">
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
                <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg">Logout</button>
            </div>
        </div>
    </div>
)}

{showSettingModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-500 dark:text-black">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <div class="flex items-center gap-x-2 cursor-pointer" onClick={() => setShowLogoutModal(true)}>
                    <img class="object-cover rounded-full h-7 w-7" src={userDetails?.profileImage} alt="avatar" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{userDetails?.fullName}</span>
                </div>
            <div onClick={() => router.push(`/my-admin/${id}/profile`)} class="cursor-pointer flex items-center px-1 py-3 mb-3 border border-b-black text-gray-600 transition-colors duration-300 transform rounded-sm dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                </svg>

                <span class="mx-2 text-sm font-medium">View Your Profile</span>
            </div>
            <div className="flex justify-end gap-4">
                <button onClick={() => setShowSettingModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg">Logout</button>
            </div>
        </div>
    </div>
)}
</>
  )
}

export default Sidebar