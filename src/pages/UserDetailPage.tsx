import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { usersApi } from '../services/api';
import logger from '../utils/logger';

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Get the page we came from (default to /users if not specified)
  const fromPath = (location.state as any)?.from || '/users';

  // Fetch user details
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getById(id!),
    enabled: !!id,
  });

  // Update user status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => usersApi.updateStatus(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      logger.info('User status updated successfully', { userId: id });
    },
    onError: (error: any) => {
      logger.error('Failed to update user status', { error, userId: id });
    },
  });

  const user = userData?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">User not found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The user you're looking for doesn't exist or has been deleted.
        </p>
        <button onClick={() => navigate(fromPath)} className="mt-4 btn-primary inline-flex items-center">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </button>
      </div>
    );
  }

  const handleStatusUpdate = (status: string) => {
    if (window.confirm(`Are you sure you want to ${status === 'active' ? 'activate' : 'suspend'} this user?`)) {
      updateStatusMutation.mutate(status);
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      suspended: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };
    return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'active') return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    if (s === 'suspended') return <XCircleIcon className="h-5 w-5 text-red-500" />;
    return <ClockIcon className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(fromPath)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={`Back to ${fromPath === '/dashboard' ? 'Dashboard' : 'Users'}`}
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
          {user.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Full Name</label>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{user.name}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">User ID</label>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{user.id}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-1" />
                  Email Address
                </label>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{user.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <ShieldCheckIcon className="h-4 w-4 mr-1" />
                  Role
                </label>
                <span
                  className={`inline-flex px-3 py-1 text-sm rounded-full mt-1 ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Details</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Account Created</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(user.createdAt).toLocaleDateString()} at {new Date(user.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>

              {user.lastLogin && (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Last Login</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(user.lastLogin).toLocaleDateString()} at{' '}
                        {new Date(user.lastLogin).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(user.status)}
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Account Status</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{user.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Orders</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Reviews</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$0.00</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Spent</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Wishlist</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button onClick={() => navigate(`/users/edit/${id}`)} className="w-full btn-primary text-sm">
                Edit User
              </button>
              {user.status === 'active' ? (
                <button
                  onClick={() => handleStatusUpdate('suspended')}
                  className="w-full btn-secondary text-sm"
                  disabled={updateStatusMutation.isPending}
                >
                  Suspend Account
                </button>
              ) : (
                <button
                  onClick={() => handleStatusUpdate('active')}
                  className="w-full btn-primary text-sm"
                  disabled={updateStatusMutation.isPending}
                >
                  Activate Account
                </button>
              )}
              <button className="w-full btn-secondary text-sm">Send Email</button>
              <button className="w-full btn-secondary text-sm">Reset Password</button>
            </div>
          </div>

          {/* Roles & Permissions */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Roles & Permissions</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Assigned Roles</p>
                <div className="flex flex-wrap gap-2">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role: string) => (
                      <span
                        key={role}
                        className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 text-xs rounded-full"
                      >
                        {role}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs rounded-full">
                      {user.role}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Two-Factor Auth</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">Disabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Email Verified</span>
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Phone Verified</span>
                <XCircleIcon className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
