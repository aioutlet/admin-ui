import React from 'react';

const ReviewsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews Management</h1>
        <button className="btn btn-primary">Moderate Reviews</button>
      </div>

      <div className="card p-6">
        <p className="text-gray-600 dark:text-gray-400">Reviews management interface coming soon...</p>
      </div>
    </div>
  );
};

export default ReviewsPage;
