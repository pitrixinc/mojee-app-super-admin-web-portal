import React from 'react';
import { useRouter } from 'next/router';
import useGetData from '../../custom-hooks/useGetData';

const AdminDashboard = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: foods } = useGetData('foods');
  const { data: orders } = useGetData('orders');
  const { data: users } = useGetData('users');

  // Filter users based on usertype buyer 
  const filteredUserBuyers = users.filter(user => user.userType === 'buyer');

  // Filter users based on usertype vendor 
  const filteredUserVendors = users.filter(user => user.userType === 'vendor');

  return (
    <div>

        <div className="relative bg-cover bg-center shadow py-10 w-[100%]"
          style={{ backgroundImage: "url('https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/a1/3e/82/chinese-mix.jpg?w=600&h=-1&s=1')" }}>
          <h1 className="text-3xl font-bold mb-8 text-center text-white">Super Admin Dashboard</h1>
          <div className="mb-8 flex justify-center">
            
          </div>
        </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 mr-2 ml-2 md:mr-0 md:ml-0 border-4 border-white rounded-lg flex flex-col justify-center min-h-[107px] md:min-h-[130px] text-center transition-all duration-300 ease-in-out hover:shadow-[0px_11px_30px_rgba(51,83,145,0.07)] hover:border-transparent">
        <p className="font-medium text-[1rem] md:text-[17px] leading-[1.77] text-white">Total Foods</p>
        <span className="text-white font-black text-[1rem] md:text-[15px] leading-[2]">{foods.length}</span>
      </div>

      <div className="bg-gradient-to-r  from-green-500 to-blue-500  mr-2 ml-2 md:mr-0 md:ml-0 border-4 border-white rounded-lg flex flex-col justify-center min-h-[107px] md:min-h-[130px] text-center transition-all duration-300 ease-in-out hover:shadow-[0px_11px_30px_rgba(51,83,145,0.07)] hover:border-transparent">
        <p className="font-medium text-[1rem] md:text-[17px] leading-[1.77] text-white">Total Vendors</p>
        <span className="text-white font-black text-[1rem] md:text-[15px] leading-[2]">{filteredUserVendors.length}</span>
      </div>

      <div className="bg-gradient-to-r  from-green-500 to-blue-500  mr-2 ml-2 md:mr-0 md:ml-0 border-4 border-white rounded-lg flex flex-col justify-center min-h-[107px] md:min-h-[130px] text-center transition-all duration-300 ease-in-out hover:shadow-[0px_11px_30px_rgba(51,83,145,0.07)] hover:border-transparent">
        <p className="font-medium text-[1rem] md:text-[17px] leading-[1.77] text-white">Total Buyers</p>
        <span className="text-white font-black text-[1rem] md:text-[15px] leading-[2]">{filteredUserBuyers.length}</span>
      </div>

     
      <div className="bg-gradient-to-r  from-green-500 to-blue-500  mr-2 ml-2 md:mr-0 md:ml-0 border-4 border-white rounded-lg flex flex-col justify-center min-h-[107px] md:min-h-[130px] text-center transition-all duration-300 ease-in-out hover:shadow-[0px_11px_30px_rgba(51,83,145,0.07)] hover:border-transparent">
        <p className="font-medium text-[1rem] md:text-[17px] leading-[1.77] text-white">Total Food Orders</p>
        <span className="text-white font-black text-[1rem] md:text-[15px] leading-[2]">{orders.length}</span>
      </div>
  
      <div className="bg-gradient-to-r  from-green-500 to-blue-500  mr-2 ml-2 md:mr-0 md:ml-0 border-4 border-white rounded-lg flex flex-col justify-center min-h-[107px] md:min-h-[130px] text-center transition-all duration-300 ease-in-out hover:shadow-[0px_11px_30px_rgba(51,83,145,0.07)] hover:border-transparent">
        <p className="font-medium text-[1rem] md:text-[17px] leading-[1.77] text-white">Total Users</p>
        <span className="text-white font-black text-[1rem] md:text-[15px] leading-[2]">{users.length}</span>
      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;