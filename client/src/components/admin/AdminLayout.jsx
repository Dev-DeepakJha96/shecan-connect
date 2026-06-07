import React from 'react';
import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="md:ml-72 transition-all duration-300">
        <div className="pt-16 md:pt-8 p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
