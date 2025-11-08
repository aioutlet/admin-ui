import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  UsersIcon,
  ShoppingBagIcon,
  CubeIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import StatCard from '../components/ui/StatCard';
import { dashboardApi } from '../services/api';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Fetch all dashboard data in a single API call
  const { data: dashboardData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-complete'],
    queryFn: () => dashboardApi.getStats(true, 5), // includeRecent=true, limit=5
    refetchOnMount: 'always',
    staleTime: 0,
  });

  // Mock data for demonstration when API is not available
  const mockStats = {
    users: { total: 1247, active: 1189, newThisMonth: 89, growth: 12.5 },
    orders: { total: 3421, pending: 23, processing: 45, completed: 3353, revenue: 125430, growth: 8.3 },
    products: { total: 567, active: 543, lowStock: 12, outOfStock: 3 },
    reviews: { total: 2156, pending: 34, averageRating: 4.2, growth: 15.2 },
  };

  const mockRecentOrders = [
    { id: '1', customer: 'John Doe', total: 129.99, status: 'processing', createdAt: new Date().toISOString() },
    { id: '2', customer: 'Jane Smith', total: 89.99, status: 'shipped', createdAt: new Date().toISOString() },
    { id: '3', customer: 'Bob Johnson', total: 199.99, status: 'pending', createdAt: new Date().toISOString() },
  ];

  const mockRecentUsers = [
    { id: '1', name: 'Alice Brown', email: 'alice@example.com', role: 'customer', createdAt: new Date().toISOString() },
    {
      id: '2',
      name: 'Charlie Wilson',
      email: 'charlie@example.com',
      role: 'customer',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'David Miller',
      email: 'david@example.com',
      role: 'customer',
      createdAt: new Date().toISOString(),
    },
  ];

  // Extract stats, recentOrders, and recentUsers from the unified response
  const stats = dashboardData?.data;

  // Check if we have real data (at least one stat > 0) or should use mocks
  const hasRealData =
    stats &&
    (stats.users?.total > 0 || stats.orders?.total > 0 || stats.products?.total > 0 || stats.reviews?.total > 0);

  const displayStats = hasRealData ? stats : mockStats;
  const displayOrders = hasRealData && stats?.recentOrders?.length > 0 ? stats.recentOrders : mockRecentOrders;
  const displayUsers = hasRealData && stats?.recentUsers?.length > 0 ? stats.recentUsers : mockRecentUsers;

  if (statsLoading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={displayStats.users.total}
          change={displayStats.users.growth}
          changeLabel="vs last month"
          icon={<UsersIcon />}
          color="blue"
        />

        <StatCard
          title="Revenue"
          value={`$${displayStats.orders.revenue.toLocaleString()}`}
          change={displayStats.orders.growth}
          changeLabel="vs last month"
          icon={<ArrowTrendingUpIcon />}
          color="green"
        />

        <StatCard
          title="Total Products"
          value={displayStats.products.total}
          change={undefined}
          changeLabel={`${displayStats.products.active} active`}
          icon={<CubeIcon />}
          color="purple"
        />

        <StatCard
          title="Avg. Rating"
          value={displayStats.reviews.averageRating}
          change={displayStats.reviews.growth}
          changeLabel="vs last month"
          icon={<StarIcon />}
          color="yellow"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="New Users"
          value={displayStats.users.newThisMonth}
          changeLabel="this month"
          icon={<UsersIcon />}
          color="indigo"
        />

        <StatCard
          title="Pending Orders"
          value={displayStats.orders.pending}
          changeLabel="need attention"
          icon={<ShoppingBagIcon />}
          color="red"
        />

        <StatCard
          title="Low Stock Items"
          value={displayStats.products.lowStock}
          changeLabel="need restocking"
          icon={<ArrowTrendingDownIcon />}
          color="yellow"
        />

        <StatCard
          title="Pending Reviews"
          value={displayStats.reviews.pending}
          changeLabel="awaiting approval"
          icon={<StarIcon />}
          color="blue"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
            <button
              onClick={() => navigate('/orders')}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {displayOrders.map((order: any) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customer}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Order #{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">${order.total}</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : order.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h2>
            <button
              onClick={() => navigate('/users')}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {displayUsers.map((user: any) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-xs">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  }`}
                >
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/users/add')}
            className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Add New User</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Create admin or customer account</p>
          </button>

          <button
            onClick={() => navigate('/products')}
            className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <CubeIcon className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Add Product</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Create new product listing</p>
          </button>

          <button
            onClick={() => navigate('/orders')}
            className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <ShoppingBagIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Process Orders</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Review pending orders</p>
          </button>

          <button
            onClick={() => navigate('/reviews')}
            className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <StarIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mb-2" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Review Management</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Moderate customer reviews</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
