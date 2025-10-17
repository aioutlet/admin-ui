import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout, setUser } from '../store/slices/authSlice';
import { authApi } from '../services/api';
import { User } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      const userStr = localStorage.getItem('admin_user');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify token with BFF
        const result = await authApi.verify();

        if (result.success) {
          setIsAuthenticated(true);

          // Restore user from localStorage if available
          if (userStr) {
            try {
              const user: User = JSON.parse(userStr);
              dispatch(setUser(user));
            } catch (e) {
              console.error('Failed to parse stored user data:', e);
            }
          }
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
