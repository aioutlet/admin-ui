import axios, { AxiosInstance } from 'axios';
import { ApiResponse, PaginatedResponse } from '../types';

// Base API configuration - Route through BFF
const BFF_API_URL = process.env.REACT_APP_BFF_API_URL || 'http://localhost:3100';

// Create axios instance for BFF API
export const bffApiClient: AxiosInstance = axios.create({
  baseURL: BFF_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookie handling for BFF
});

// Legacy clients (kept for backward compatibility but will route through BFF)
export const authApiClient = bffApiClient;
export const adminApiClient = bffApiClient;

// Request interceptor for BFF API
bffApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for BFF API error handling
bffApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  login: async (
    email: string,
    password: string
  ): Promise<ApiResponse<{ user: any; token: string; refreshToken: string }>> => {
    try {
      const response = await authApiClient.post('/api/auth/login', {
        email,
        password,
      });

      console.log('Login response:', response.data);

      // Auth service returns: { jwt, user: { _id, email, firstName, lastName, roles, isActive, ... } }
      if (response.data.jwt && response.data.user) {
        const backendUser = response.data.user;
        const frontendUser = {
          id: backendUser._id || backendUser.id,
          name: `${backendUser.firstName} ${backendUser.lastName}`,
          email: backendUser.email,
          role: (backendUser.roles?.includes('admin') ? 'admin' : 'customer') as 'customer' | 'admin' | 'super_admin',
          status: (backendUser.isActive ? 'active' : 'inactive') as 'active' | 'inactive' | 'suspended',
          createdAt: backendUser.createdAt || new Date().toISOString(),
          lastLogin: backendUser.lastLoginAt || new Date().toISOString(),
        };

        return {
          success: true,
          data: {
            user: frontendUser,
            token: response.data.jwt,
            refreshToken: response.data.refreshToken || '', // Auth service may not return refresh token
          },
        };
      } else {
        return {
          success: false,
          data: { user: null as any, token: '', refreshToken: '' },
          message: response.data.error?.message || 'Invalid login response from server',
        };
      }
    } catch (error: any) {
      console.error('Login error:', error.response?.data);
      return {
        success: false,
        data: { user: null as any, token: '', refreshToken: '' },
        message: error.response?.data?.error?.message || error.response?.data?.message || 'Login failed',
      };
    }
  },

  verify: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await authApiClient.get('/api/auth/verify');
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.error?.message || 'Token verification failed',
      };
    }
  },

  logout: async (): Promise<ApiResponse<null>> => {
    try {
      const refreshToken = localStorage.getItem('admin_refresh_token');
      const response = await authApiClient.post('/api/auth/logout', { refreshToken });
      return {
        success: true,
        data: null,
        message: response.data.message || 'Logged out successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.error?.message || 'Logout failed',
      };
    }
  },
};

// Users API functions
export const usersApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; role?: string; status?: string }) => {
    const response = await adminApiClient.get<PaginatedResponse<any>>('/users', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await adminApiClient.get<ApiResponse<any>>(`/users/${id}`);
    return response.data;
  },

  create: async (userData: any) => {
    const response = await adminApiClient.post<ApiResponse<any>>('/users', userData);
    return response.data;
  },

  update: async (id: string, userData: any) => {
    const response = await adminApiClient.put<ApiResponse<any>>(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await adminApiClient.delete<ApiResponse<null>>(`/users/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await adminApiClient.patch<ApiResponse<any>>(`/users/${id}/status`, { status });
    return response.data;
  },
};

// Products API functions
export const productsApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; category?: string; status?: string }) => {
    const response = await adminApiClient.get<PaginatedResponse<any>>('/products', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await adminApiClient.get<ApiResponse<any>>(`/products/${id}`);
    return response.data;
  },

  create: async (productData: any) => {
    const response = await adminApiClient.post<ApiResponse<any>>('/products', productData);
    return response.data;
  },

  update: async (id: string, productData: any) => {
    const response = await adminApiClient.put<ApiResponse<any>>(`/products/${id}`, productData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await adminApiClient.delete<ApiResponse<null>>(`/products/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await adminApiClient.patch<ApiResponse<any>>(`/products/${id}/status`, { status });
    return response.data;
  },
};

// Orders API functions
export const ordersApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const response = await adminApiClient.get<PaginatedResponse<any>>('/orders', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await adminApiClient.get<ApiResponse<any>>(`/orders/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await adminApiClient.patch<ApiResponse<any>>(`/orders/${id}/status`, { status });
    return response.data;
  },

  addNote: async (id: string, note: string) => {
    const response = await adminApiClient.post<ApiResponse<any>>(`/orders/${id}/notes`, { note });
    return response.data;
  },

  updateTracking: async (id: string, trackingNumber: string) => {
    const response = await adminApiClient.patch<ApiResponse<any>>(`/orders/${id}/tracking`, { trackingNumber });
    return response.data;
  },
};

// Reviews API functions
export const reviewsApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; status?: string; rating?: number }) => {
    const response = await adminApiClient.get<PaginatedResponse<any>>('/reviews', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await adminApiClient.get<ApiResponse<any>>(`/reviews/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await adminApiClient.patch<ApiResponse<any>>(`/reviews/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await adminApiClient.delete<ApiResponse<null>>(`/reviews/${id}`);
    return response.data;
  },
};

// Inventory API functions
export const inventoryApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; lowStock?: boolean }) => {
    const response = await adminApiClient.get<PaginatedResponse<any>>('/inventory', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await adminApiClient.get<ApiResponse<any>>(`/inventory/${id}`);
    return response.data;
  },

  updateStock: async (id: string, quantity: number, reason: string) => {
    const response = await adminApiClient.patch<ApiResponse<any>>(`/inventory/${id}/stock`, { quantity, reason });
    return response.data;
  },

  getMovements: async (id: string) => {
    const response = await adminApiClient.get<ApiResponse<any[]>>(`/inventory/${id}/movements`);
    return response.data;
  },
};

// Dashboard API functions
export const dashboardApi = {
  getStats: async () => {
    const response = await adminApiClient.get<ApiResponse<any>>('/api/admin/dashboard/stats');
    return response.data;
  },

  getRecentOrders: async () => {
    const response = await adminApiClient.get<ApiResponse<any[]>>('/api/admin/dashboard/recent-orders');
    return response.data;
  },

  getRecentUsers: async () => {
    const response = await adminApiClient.get<ApiResponse<any[]>>('/api/admin/dashboard/recent-users');
    return response.data;
  },

  getAnalytics: async (period: string) => {
    const response = await adminApiClient.get<ApiResponse<any>>(`/api/admin/dashboard/analytics?period=${period}`);
    return response.data;
  },
};
