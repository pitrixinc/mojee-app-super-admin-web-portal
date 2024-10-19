import React, { useCallback } from 'react';
;
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  
  return (
    <React.Fragment className="flex h-screen">
        <div className='w-[20%]'>
        <Sidebar />
        </div>
      <main className="flex-1 md:p-4 lg:p-4 overflow-auto bg-gray-900 text-white dark:bg-gray-900 dark:text-gray-300"
        sx={{
          variant: 'layout.main',
        }}
      >
        {children}
      </main>
    </React.Fragment>
  );
}
