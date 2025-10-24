// Core admin types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin'; // Primary role for backward compatibility
  roles: ('customer' | 'admin')[]; // All roles
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  profileImage?: string;
  phone?: string;
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  brand?: string;
  sku: string;
  status: 'active' | 'inactive' | 'draft';
  stock: number;
  images: string[];
  tags: string[];
  specifications?: Record<string, string>;
  highlights?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  orderNumber: string;
  status: 'Created' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
  paymentStatus: 'Pending' | 'Authorized' | 'Captured' | 'Failed' | 'Cancelled' | 'Refunded';
  shippingStatus: 'NotShipped' | 'Preparing' | 'Shipped' | 'InTransit' | 'Delivered' | 'Returned';
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  taxRate?: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethodId?: string;
  paymentProvider?: string;
  paymentTransactionId?: string;
  paymentReference?: string;
  shippingMethod?: string;
  carrierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  notes?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  shippedDate?: string;
  deliveredDate?: string;
  createdBy: string;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

export interface OrderItem {
  id: string;
  orderId?: string;
  productId: string;
  productName: string;
  productSku?: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  originalPrice?: number;
  discountAmount?: number;
  discountPercentage?: number;
  taxAmount?: number;
  shippingCostPerItem?: number;
  totalPrice: number;
  isGift?: boolean;
  giftMessage?: string;
  giftWrapCost?: number;
  notes?: string;
}

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Review {
  id: string;
  productId: string;
  product?: Product;
  userId: string;
  user?: User;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  helpfulVotes?: {
    helpful: number;
    notHelpful: number;
    userVotes?: Array<{
      userId: string;
      vote: 'helpful' | 'notHelpful';
      votedAt: string;
    }>;
  };
  verified?: boolean;
}

export interface InventoryItem {
  id: string;
  productId: string;
  product?: Product;
  stock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  location: string;
  lastUpdated: string;
  movements: InventoryMovement[];
}

export interface InventoryMovement {
  id: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  createdAt: string;
  createdBy: string;
}

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    revenue: number;
    growth: number;
  };
  products: {
    total: number;
    active: number;
    lowStock: number;
    outOfStock: number;
  };
  reviews: {
    total: number;
    pending: number;
    averageRating: number;
    growth: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}
