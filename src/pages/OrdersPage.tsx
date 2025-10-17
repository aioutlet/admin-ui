import React from 'react';

const OrdersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders Management</h1>
        <button className="btn btn-primary">Export Orders</button>
      </div>

      <div className="card p-6">
        <p className="text-gray-600 dark:text-gray-400">Orders management interface coming soon...</p>
      </div>
    </div>
  );
};

export default OrdersPage;
