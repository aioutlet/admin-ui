import React from 'react';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
        <button className="btn btn-primary">Generate Report</button>
      </div>

      <div className="card p-6">
        <p className="text-gray-600 dark:text-gray-400">Analytics dashboard coming soon...</p>
      </div>
    </div>
  );
};

export default AnalyticsPage;
