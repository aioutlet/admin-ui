import React from 'react';

const InventoryPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
        <button className="btn btn-primary">Add Stock Movement</button>
      </div>

      <div className="card p-6">
        <p className="text-gray-600 dark:text-gray-400">Inventory management interface coming soon...</p>
      </div>
    </div>
  );
};

export default InventoryPage;
