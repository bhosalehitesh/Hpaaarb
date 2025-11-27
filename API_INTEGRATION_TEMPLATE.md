# 🔌 API Integration Template

This document provides code templates for integrating backend APIs with the frontend.

## 📋 When Backend Team Provides APIs

Replace the placeholder API names with actual endpoint names from your backend.

---

## 🔐 Authentication APIs

### File: `Frontend/src/services/authAPI.ts`

```typescript
import { API_BASE_URL } from '../utils/apiConfig';
import { storage, AUTH_TOKEN_KEY } from '../authentication/storage';

interface SignupRequest {
  fullName: string;
  phone: string;
  password: string;
}

interface LoginRequest {
  phone: string;
  password: string;
}

interface VerifyOtpRequest {
  phone: string;
  code: string;
}

interface AuthResponse {
  token: string;
  userId: number;
  fullName: string;
  phone: string;
}

/**
 * Sign up a new seller
 */
export const signup = async (data: SignupRequest): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Signup failed');
  }

  const result = await response.text();
  // Extract OTP from response (for dev mode)
  const otpMatch = result.match(/\(for testing: (\d+)\)/);
  return otpMatch ? otpMatch[1] : '';
};

/**
 * Verify OTP
 */
export const verifyOtp = async (data: VerifyOtpRequest): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'OTP verification failed');
  }
};

/**
 * Login seller
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Login failed');
  }

  const result: AuthResponse = await response.json();
  
  // Store token
  await storage.setItem(AUTH_TOKEN_KEY, result.token);
  
  return result;
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<AuthResponse> => {
  const token = await storage.getItem(AUTH_TOKEN_KEY);
  
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user');
  }

  return response.json();
};

/**
 * Logout
 */
export const logout = async (): Promise<void> => {
  const token = await storage.getItem(AUTH_TOKEN_KEY);
  
  await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  // Remove token locally
  await storage.removeItem(AUTH_TOKEN_KEY);
};
```

---

## 📦 Products APIs

### File: `Frontend/src/services/productsAPI.ts`

```typescript
import { API_BASE_URL } from '../utils/apiConfig';
import { getAuthHeaders } from './apiUtils';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  categoryId: number;
  categoryName?: string;
  stock: number;
  sku?: string;
  weight?: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  categoryId: number;
  stock: number;
  sku?: string;
  weight?: number;
}

/**
 * Get all products for current seller
 */
export const getProducts = async (): Promise<Product[]> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const data = await response.json();
  return data.products || data;
};

/**
 * Get product by ID
 */
export const getProductById = async (id: number): Promise<Product> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }

  return response.json();
};

/**
 * Create new product
 */
export const createProduct = async (
  productData: CreateProductRequest
): Promise<Product> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers,
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to create product');
  }

  return response.json();
};

/**
 * Update product
 */
export const updateProduct = async (
  id: number,
  productData: Partial<CreateProductRequest>
): Promise<Product> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to update product');
  }

  return response.json();
};

/**
 * Delete product
 */
export const deleteProduct = async (id: number): Promise<void> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
};

/**
 * Upload product image
 */
export const uploadProductImage = async (
  imageUri: string
): Promise<string> => {
  const headers = await getAuthHeaders();
  
  // Convert image to FormData
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'product.jpg',
  } as any);

  const response = await fetch(`${API_BASE_URL}/api/products/upload-image`, {
    method: 'POST',
    headers: {
      'Authorization': headers.Authorization,
      // Don't set Content-Type for FormData
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await response.json();
  return data.imageUrl;
};
```

---

## 📂 Categories APIs

### File: `Frontend/src/services/categoriesAPI.ts`

```typescript
import { API_BASE_URL } from '../utils/apiConfig';
import { getAuthHeaders } from './apiUtils';

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  parentId?: number;
  createdAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  image?: string;
  parentId?: number;
}

/**
 * Get all categories
 */
export const getCategories = async (): Promise<Category[]> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/api/categories`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data = await response.json();
  return data.categories || data;
};

/**
 * Create category
 */
export const createCategory = async (
  categoryData: CreateCategoryRequest
): Promise<Category> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/api/categories`, {
    method: 'POST',
    headers,
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to create category');
  }

  return response.json();
};

/**
 * Update category
 */
export const updateCategory = async (
  id: number,
  categoryData: Partial<CreateCategoryRequest>
): Promise<Category> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    throw new Error('Failed to update category');
  }

  return response.json();
};

/**
 * Delete category
 */
export const deleteCategory = async (id: number): Promise<void> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to delete category');
  }
};
```

---

## 📋 Orders APIs

### File: `Frontend/src/services/ordersAPI.ts`

```typescript
import { API_BASE_URL } from '../utils/apiConfig';
import { getAuthHeaders } from './apiUtils';

export type OrderStatus = 
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'pickup_ready'
  | 'shipped'
  | 'delivered'
  | 'canceled';

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: 'cod' | 'online' | 'upi';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}

/**
 * Get all orders
 */
export const getOrders = async (
  status?: OrderStatus
): Promise<Order[]> => {
  const headers = await getAuthHeaders();
  
  const url = status
    ? `${API_BASE_URL}/api/orders?status=${status}`
    : `${API_BASE_URL}/api/orders`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  const data = await response.json();
  return data.orders || data;
};

/**
 * Get order by ID
 */
export const getOrderById = async (id: number): Promise<Order> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }

  return response.json();
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  id: number,
  status: OrderStatus,
  notes?: string
): Promise<Order> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ status, notes }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to update order status');
  }

  return response.json();
};
```

---

## 📊 Analytics APIs

### File: `Frontend/src/services/analyticsAPI.ts`

```typescript
import { API_BASE_URL } from '../utils/apiConfig';
import { getAuthHeaders } from './apiUtils';

export interface SalesData {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  salesByDate: { date: string; sales: number }[];
}

export interface CustomerData {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
}

export interface ProductAnalytics {
  topProducts: {
    productId: number;
    productName: string;
    sales: number;
    quantity: number;
  }[];
  lowStock: {
    productId: number;
    productName: string;
    stock: number;
  }[];
}

/**
 * Get sales analytics
 */
export const getSalesAnalytics = async (
  startDate?: string,
  endDate?: string
): Promise<SalesData> => {
  const headers = await getAuthHeaders();
  
  const url = new URL(`${API_BASE_URL}/api/analytics/sales`);
  if (startDate) url.searchParams.append('startDate', startDate);
  if (endDate) url.searchParams.append('endDate', endDate);
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sales analytics');
  }

  return response.json();
};

/**
 * Get customer analytics
 */
export const getCustomerAnalytics = async (): Promise<CustomerData> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/api/analytics/customers`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch customer analytics');
  }

  return response.json();
};

/**
 * Get product analytics
 */
export const getProductAnalytics = async (): Promise<ProductAnalytics> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/api/analytics/products`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch product analytics');
  }

  return response.json();
};
```

---

## 🛠️ API Utility Functions

### File: `Frontend/src/services/apiUtils.ts`

```typescript
import { storage, AUTH_TOKEN_KEY } from '../authentication/storage';

/**
 * Get authentication headers
 */
export const getAuthHeaders = async (): Promise<HeadersInit> => {
  const token = await storage.getItem(AUTH_TOKEN_KEY);
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * Handle API errors
 */
export const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = 'An error occurred';
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || errorMessage;
  } catch {
    const errorText = await response.text();
    errorMessage = errorText || errorMessage;
  }

  // Handle specific status codes
  if (response.status === 401) {
    // Unauthorized - token expired or invalid
    await storage.removeItem(AUTH_TOKEN_KEY);
    throw new Error('Session expired. Please login again.');
  }

  if (response.status === 403) {
    throw new Error('You do not have permission to perform this action.');
  }

  if (response.status === 404) {
    throw new Error('Resource not found.');
  }

  if (response.status >= 500) {
    throw new Error('Server error. Please try again later.');
  }

  throw new Error(errorMessage);
};

/**
 * Make authenticated API call
 */
export const apiCall = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response;
};
```

---

## 📝 Usage Example in Components

### Example: ProductsScreen.tsx

```typescript
import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { getProducts, Product, deleteProduct } from '../services/productsAPI';

const ProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      // Refresh list
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onDelete={() => handleDelete(item.id)}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};
```

---

## 🔄 Next Steps

1. **Replace API endpoint URLs** with actual backend endpoints
2. **Update request/response types** based on backend DTOs
3. **Test each API** individually
4. **Integrate into components** replacing mock data
5. **Add error handling** and loading states
6. **Test complete flows** end-to-end

---

**Note**: Update this template with actual API names and structures when backend is provided.

