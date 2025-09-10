// AdminPage.jsx
import React, { useState } from 'react';
import './AdminPage.css';

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch(activeSection) {
      case 'products':
        return <div className="p-6">Product Management Content</div>;
      case 'customers':
        return <div className="p-6">Customer Management Content</div>;
      case 'quotations':
        return <div className="p-6">View Quotations Content</div>;
      case 'reservations':
        return <div className="p-6">View Reservations Content</div>;
      case 'feedbacks':
        return <div className="p-6">Customer Feedbacks Content</div>;
      case 'suppliers':
        return <div className="p-6">Supplier Management Content</div>;
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold">Total Products</h3>
                <p className="text-3xl mt-2">128</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold">New Orders</h3>
                <p className="text-3xl mt-2">24</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold">Pending Requests</h3>
                <p className="text-3xl mt-2">8</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-container flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="sidebar w-64 bg-gray-800 text-white">
        <div className="p-5 border-b border-gray-700">
          <h1 className="text-xl font-bold">NS STORES</h1>
          <p className="text-sm text-gray-400">Admin Panel</p>
        </div>
        
        <nav className="mt-6">
          
          <button 
            className={`w-full text-left px-4 py-3 flex items-center ${activeSection === 'products' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveSection('products')}
          >
            <span>Product Management</span>
          </button>
          
          <button 
            className={`w-full text-left px-4 py-3 flex items-center ${activeSection === 'customers' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveSection('customers')}
          >
            <span>Customer Management</span>
          </button>
          
          
          <button 
            className={`w-full text-left px-4 py-3 flex items-center ${activeSection === 'quotations' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveSection('quotations')}
          >
            <span>View Quotations</span>
          </button>
          
          <button 
            className={`w-full text-left px-4 py-3 flex items-center ${activeSection === 'reservations' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveSection('reservations')}
          >
            <span>View Reservations</span>
          </button>
          
          <button 
            className={`w-full text-left px-4 py-3 flex items-center ${activeSection === 'feedbacks' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveSection('feedbacks')}
          >
            <span>Customer Feedbacks</span>
          </button>
          
          <button 
            className={`w-full text-left px-4 py-3 flex items-center ${activeSection === 'suppliers' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveSection('suppliers')}
          >
            <span>Supplier Management</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AdminPage;