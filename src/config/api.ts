// ===========================================
// API Configuration & Helper Functions
// ===========================================

// Base URL - reads from environment variable or defaults to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
  role: 'visitor' | 'admin';
  isEmailVerified: boolean;
};

// ===========================================
// Core API Function
// ===========================================
export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    credentials: 'include', // Include cookies for authentication
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
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
  register: (data: { email: string; password: string; name: string }) =>
    apiPost<User>('/auth/register', data),

  // Login
  login: (data: { email: string; password: string }) =>
    apiPost<{ user: User; token: string }>('/auth/login', data),

  // Logout
  logout: () => apiPost<null>('/auth/logout'),

  // Get current user
  me: () => apiGet<User>('/auth/me'),
};

// ===========================================
// File Upload Helper
// ===========================================
export async function apiUpload<T>(
  endpoint: string,
  formData: FormData
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: formData,
    // Don't set Content-Type header, let browser set it with boundary
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
}

