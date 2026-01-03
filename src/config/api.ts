// ===========================================
// API Configuration & Helper Functions
// ===========================================

// Base URL for VPS
export const API_BASE_URL = 'https://uigtc.id/api';

// Types
export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  type: 'merchandise' | 'ticket';
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
  productType: 'merchandise' | 'ticket_single' | 'ticket_bundle';
  isActive: boolean;
  category: Category | null;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  schoolOrigin?: string;
  role: 'visitor' | 'admin';
  isEmailVerified: boolean;
};

// ===========================================
// Helper to get auth token
// ===========================================
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

// ===========================================
// Core API Function
// ===========================================
export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers,
  };

  // Merge headers properly
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...headers,
      ...(options?.headers as Record<string, string> || {}),
    },
  };

  try {
    const response = await fetch(url, mergedOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error');
  }
}

// ===========================================
// HTTP Method Helpers
// ===========================================
export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, { method: 'GET' });
}

export async function apiPost<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiPut<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, { method: 'DELETE' });
}

// ===========================================
// Product API
// ===========================================
export const productApi = {
  // Get all products
  getAll: () => apiGet<Product[]>('/products'),

  // Get merchandise products
  getMerchandise: (category?: string) =>
    apiGet<Product[]>(`/products/merchandise${category ? `?category=${category}` : ''}`),

  // Get tickets
  getTickets: () => apiGet<Product[]>('/products/tickets'),

  // Get single product
  getById: (id: string) => apiGet<Product>(`/products/${id}`),

  // Get categories
  getCategories: () => apiGet<Category[]>('/products/categories'),

  // Get merchandise categories
  getMerchandiseCategories: () => apiGet<Category[]>('/products/categories/merchandise'),
};

// ===========================================
// Auth API
// ===========================================
export const authApi = {
  // Register
  register: (data: { 
    email: string; 
    password: string; 
    name: string;
    phoneNumber: string;
    schoolOrigin: string;
  }) => apiPost<User>('/auth/register', data),

  // Login
  login: (data: { email: string; password: string }) =>
    apiPost<{ user: User; token: string }>('/auth/login', data),

  // Logout
  logout: () => apiPost<null>('/auth/logout'),

  // Get current user
  me: () => apiGet<User>('/auth/me'),
};

// ===========================================
// Orders API
// ===========================================
export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
};

export type Order = {
  id: string;
  userId: string;
  status: 'pending' | 'waiting_payment' | 'payment_review' | 'completed' | 'rejected' | 'cancelled';
  totalAmount: number;
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  paymentProof?: string;
  rejectionReason?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderData = {
  productId: string;
  quantity: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
};

export const ordersApi = {
  // Get user's orders
  getMyOrders: () => apiGet<Order[]>('/orders/my-orders'),

  // Get order by ID
  getById: (id: string) => apiGet<Order>(`/orders/${id}`),

  // Create order
  create: (data: CreateOrderData) => apiPost<Order>('/orders', data),

  // Upload payment proof
  uploadProof: async (orderId: string, file: File) => {
    const formData = new FormData();
    formData.append('paymentProof', file);
    return apiUpload<{ orderId: string; paymentProof: string }>(`/orders/${orderId}/upload-proof`, formData);
  },
};

// ===========================================
// Cart API
// ===========================================
export type CartItem = {
  id: string;
  quantity: number;
  product: Product;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
};

export const cartApi = {
  // Get cart
  get: () => apiGet<Cart>('/cart'),

  // Add item to cart
  addItem: (data: { productId: string; quantity: number }) => 
    apiPost<Cart>('/cart', data),

  // Remove item from cart
  removeItem: (itemId: string) => apiDelete<Cart>(`/cart/${itemId}`),

  // Update item quantity (if available)
  updateItem: (itemId: string, quantity: number) => 
    apiPut<Cart>(`/cart/${itemId}`, { quantity }),
};

// ===========================================
// File Upload Helper
// ===========================================
export async function apiUpload<T>(
  endpoint: string,
  formData: FormData
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {};
  
  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: formData,
    // Don't set Content-Type header, let browser set it with boundary
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
}

