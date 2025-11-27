# 🔗 Complete Integration Guide - SakhiHP Platform

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Complete Workflow](#complete-workflow)
3. [Project Architecture](#project-architecture)
4. [Backend Integration Steps](#backend-integration-steps)
5. [API Integration Workflow](#api-integration-workflow)
6. [Frontend Structure](#frontend-structure)
7. [Key Considerations](#key-considerations)
8. [Testing Strategy](#testing-strategy)

---

## 🎯 System Overview

### Three Main Components

1. **Seller Mobile App (React Native)** - `Frontend/`
   - Store owners manage their business
   - Create products, manage orders, view analytics
   - Currently exists and partially integrated

2. **Customer-Facing Website (Static Frontend)** - `CustomerWebsite/` (to be created)
   - Customers browse and buy products
   - Each seller gets a unique store URL
   - Example: `https://sakhi.com/store/seller-store-name`

3. **Backend API (Spring Boot)** - `Backend/`
   - RESTful API serving both mobile app and website
   - Handles authentication, products, orders, payments
   - Will be provided by backend team

---

## 🔄 Complete Workflow

### Phase 1: Seller Onboarding

```
1. Seller Downloads Mobile App
   ↓
2. Seller Signs Up (Phone + Password)
   ↓
3. OTP Verification
   ↓
4. Onboarding Flow:
   - Store Name
   - Business Info
   - Location Details
   - Product Categories
   - Store Policies
   ↓
5. Backend Creates:
   - Seller Account
   - Store Profile
   - Unique Store URL (e.g., sakhi.com/store/seller-name)
   - Store Website (auto-generated)
   ↓
6. Seller Can Now:
   - Add Products
   - Manage Orders
   - View Analytics
   - Share Store Link
```

### Phase 2: Store Management (Seller App)

```
Seller Mobile App Features:
├── Home Dashboard
│   ├── Store Overview
│   ├── Quick Stats
│   └── Store Link Sharing
│
├── Catalog Management
│   ├── Products (Add/Edit/Delete)
│   ├── Categories
│   └── Collections
│
├── Orders
│   ├── Pending Orders
│   ├── Accepted Orders
│   ├── Shipped Orders
│   └── Delivered Orders
│
├── Analytics
│   ├── Sales Reports
│   ├── Customer Insights
│   └── Performance Metrics
│
└── Profile/Settings
    ├── Store Appearance
    ├── Payment Settings
    ├── Shipping Configuration
    └── Store Policies
```

### Phase 3: Customer Shopping (Website)

```
Customer Journey:
1. Customer Receives Store Link (from seller)
   ↓
2. Opens Website: https://sakhi.com/store/seller-name
   ↓
3. Browses Products
   - View Categories
   - Search Products
   - View Product Details
   ↓
4. Adds to Cart
   ↓
5. Checkout Process:
   - Enter Delivery Address
   - Select Payment Method
   - Place Order
   ↓
6. Order Notification Sent to Seller
   ↓
7. Seller Processes Order (via Mobile App)
   ↓
8. Customer Tracks Order (via Website)
```

---

## 🏗️ Project Architecture

### Current Structure

```
SakhiHP/
├── Backend/                    # Spring Boot API (will be provided)
│   └── store/
│       ├── src/main/java/      # Java source code
│       └── src/main/resources/
│           └── application.properties
│
├── Frontend/                   # Seller Mobile App (React Native)
│   ├── src/
│   │   ├── authentication/    # Auth screens
│   │   ├── screens/           # App screens
│   │   ├── components/         # Reusable components
│   │   ├── services/          # API services
│   │   └── utils/              # Utilities
│   └── package.json
│
└── CustomerWebsite/            # Customer Website (TO BE CREATED)
    ├── public/                 # Static assets
    ├── src/
    │   ├── pages/              # Website pages
    │   ├── components/         # React components
    │   ├── services/           # API services
    │   └── utils/              # Utilities
    └── package.json
```

### Data Flow

```
┌─────────────────┐
│  Seller App     │
│  (React Native) │
└────────┬────────┘
         │
         │ HTTP/REST API
         │
         ▼
┌─────────────────┐
│  Backend API    │
│  (Spring Boot)  │
└────────┬────────┘
         │
         │ Database Queries
         │
         ▼
┌─────────────────┐
│  PostgreSQL     │
│  Database       │
└─────────────────┘
         ▲
         │
         │ HTTP/REST API
         │
┌────────┴────────┐
│  Customer       │
│  Website        │
│  (React/Next.js)│
└─────────────────┘
```

---

## 🔌 Backend Integration Steps

### Step 1: Receive Backend Folder

When backend team provides the backend folder:

```
Expected Structure:
Backend/
└── store/
    ├── pom.xml
    ├── src/
    │   └── main/
    │       ├── java/
    │       │   └── com/sakhi/store/
    │       │       ├── controller/     # API endpoints
    │       │       ├── service/        # Business logic
    │       │       ├── model/          # Database models
    │       │       ├── repository/     # Data access
    │       │       └── dto/            # Data transfer objects
    │       └── resources/
    │           └── application.properties
    └── target/
```

### Step 2: Analyze Backend API

**Document all API endpoints:**

Create a file: `Backend/API_DOCUMENTATION.md`

For each endpoint, document:
- **URL**: `/api/products`
- **Method**: `GET`, `POST`, `PUT`, `DELETE`
- **Request Body**: JSON structure
- **Response**: JSON structure
- **Authentication**: Required? (JWT token)
- **Example Request/Response**

**Example:**

```markdown
## Products API

### Get All Products
- **URL**: `GET /api/products`
- **Auth**: Required (Bearer Token)
- **Response**:
```json
{
  "products": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 100,
      "description": "Product description",
      "image": "https://...",
      "category": "Category Name",
      "stock": 50
    }
  ]
}
```

### Create Product
- **URL**: `POST /api/products`
- **Auth**: Required (Bearer Token)
- **Request Body**:
```json
{
  "name": "Product Name",
  "price": 100,
  "description": "Description",
  "categoryId": 1,
  "stock": 50,
  "images": ["url1", "url2"]
}
```
```

### Step 3: Update API Configuration

**File**: `Frontend/src/utils/apiConfig.ts`

```typescript
// Development
export const API_BASE_URL_DEV = 'http://localhost:8080';
export const API_BASE_URL_DEV_IP = 'http://192.168.1.100:8080'; // Your local IP

// Production
export const API_BASE_URL_PROD = 'https://api.sakhi.com';

// Current environment
export const USE_IP_ADDRESS = false; // Set to true for physical device testing
```

### Step 4: Create API Service Layer

**File**: `Frontend/src/services/api.ts` (already exists, update it)

Structure your API calls by feature:

```typescript
// Authentication API
export const authAPI = {
  signup: (data) => fetch('/api/auth/signup', ...),
  login: (data) => fetch('/api/auth/login', ...),
  verifyOtp: (data) => fetch('/api/auth/verify-otp', ...),
};

// Products API
export const productsAPI = {
  getAll: () => fetch('/api/products', ...),
  getById: (id) => fetch(`/api/products/${id}`, ...),
  create: (data) => fetch('/api/products', ...),
  update: (id, data) => fetch(`/api/products/${id}`, ...),
  delete: (id) => fetch(`/api/products/${id}`, ...),
};

// Orders API
export const ordersAPI = {
  getAll: () => fetch('/api/orders', ...),
  getById: (id) => fetch(`/api/orders/${id}`, ...),
  updateStatus: (id, status) => fetch(`/api/orders/${id}/status`, ...),
};

// Categories API
export const categoriesAPI = {
  getAll: () => fetch('/api/categories', ...),
  create: (data) => fetch('/api/categories', ...),
};

// Analytics API
export const analyticsAPI = {
  getSales: () => fetch('/api/analytics/sales', ...),
  getCustomers: () => fetch('/api/analytics/customers', ...),
};
```

### Step 5: Add Authentication Token to Requests

**Update API utility to include JWT token:**

```typescript
// Frontend/src/utils/api.ts

import { storage, AUTH_TOKEN_KEY } from '../authentication/storage';

const getAuthHeaders = async () => {
  const token = await storage.getItem(AUTH_TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const apiCall = async (url: string, options: RequestInit = {}) => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Token expired, logout user
    // Handle logout
  }

  return response;
};
```

---

## 📱 Frontend Structure

### Seller Mobile App Integration Points

#### 1. Authentication Flow

**Files to Update:**
- `Frontend/src/authentication/UnifiedAuthScreen.tsx`
- `Frontend/src/services/api.ts`

**Integration:**
```typescript
// When backend provides auth endpoints:
// POST /api/auth/signup
// POST /api/auth/login
// POST /api/auth/verify-otp

// Update signup function:
export const signup = async (data: SignupRequest) => {
  const response = await apiCall(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
};
```

#### 2. Products Management

**Files to Update:**
- `Frontend/src/screens/Catalog/products/ProductsScreen.tsx`
- `Frontend/src/screens/Catalog/products/AddProductScreen.tsx`

**Integration:**
```typescript
// Replace mock data with API calls:

// Get Products
const fetchProducts = async () => {
  const response = await apiCall(`${API_BASE_URL}/api/products`);
  const data = await response.json();
  setProducts(data.products);
};

// Create Product
const createProduct = async (productData) => {
  const response = await apiCall(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    body: JSON.stringify(productData),
  });
  return response.json();
};
```

#### 3. Orders Management

**Files to Update:**
- `Frontend/src/screens/Orders/OrdersScreen.tsx`
- All order status screens

**Integration:**
```typescript
// Get Orders
const fetchOrders = async (status?: string) => {
  const url = status 
    ? `${API_BASE_URL}/api/orders?status=${status}`
    : `${API_BASE_URL}/api/orders`;
  
  const response = await apiCall(url);
  return response.json();
};

// Update Order Status
const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await apiCall(
    `${API_BASE_URL}/api/orders/${orderId}/status`,
    {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }
  );
  return response.json();
};
```

#### 4. Analytics

**Files to Update:**
- `Frontend/src/screens/Analytics/AnalyticsScreen.tsx`
- `Frontend/src/screens/Analytics/useAnalyticsData.ts`

**Integration:**
```typescript
// Replace mockData with API calls:
const fetchAnalytics = async () => {
  const [sales, customers, products] = await Promise.all([
    apiCall(`${API_BASE_URL}/api/analytics/sales`),
    apiCall(`${API_BASE_URL}/api/analytics/customers`),
    apiCall(`${API_BASE_URL}/api/analytics/products`),
  ]);
  
  return {
    sales: await sales.json(),
    customers: await customers.json(),
    products: await products.json(),
  };
};
```

---

## 🌐 Customer Website Integration

### Step 1: Create Customer Website Structure

```
CustomerWebsite/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── pages/
│   │   ├── StorePage.tsx          # Main store page (dynamic route)
│   │   ├── ProductPage.tsx        # Product details
│   │   ├── CartPage.tsx           # Shopping cart
│   │   ├── CheckoutPage.tsx       # Checkout process
│   │   └── OrderTrackingPage.tsx  # Track order
│   ├── components/
│   │   ├── ProductCard.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── CartItem.tsx
│   │   └── Header.tsx
│   ├── services/
│   │   └── api.ts                 # API calls to backend
│   ├── context/
│   │   └── CartContext.tsx        # Cart state management
│   └── utils/
│       └── apiConfig.ts
├── package.json
└── next.config.js (if using Next.js)
```

### Step 2: Website API Integration

**File**: `CustomerWebsite/src/services/api.ts`

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Public APIs (no auth required)
export const storeAPI = {
  // Get store by URL slug
  getStoreBySlug: async (slug: string) => {
    const response = await fetch(`${API_BASE_URL}/api/stores/${slug}`);
    return response.json();
  },
  
  // Get products for a store
  getStoreProducts: async (storeId: string, filters?: any) => {
    const url = new URL(`${API_BASE_URL}/api/stores/${storeId}/products`);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        url.searchParams.append(key, value as string);
      });
    }
    const response = await fetch(url.toString());
    return response.json();
  },
  
  // Get product details
  getProduct: async (productId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
    return response.json();
  },
};

// Order APIs (customer actions)
export const orderAPI = {
  // Create order (checkout)
  createOrder: async (orderData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return response.json();
  },
  
  // Track order
  trackOrder: async (orderId: string, phone: string) => {
    const response = await fetch(
      `${API_BASE_URL}/api/orders/${orderId}/track?phone=${phone}`
    );
    return response.json();
  },
};
```

### Step 3: Dynamic Store Routing

**If using Next.js:**

```typescript
// pages/store/[slug].tsx
import { useRouter } from 'next/router';
import { storeAPI } from '../../services/api';

export default function StorePage() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    if (slug) {
      // Fetch store data
      storeAPI.getStoreBySlug(slug).then(setStore);
      // Fetch products
      storeAPI.getStoreProducts(store.id).then(data => setProducts(data.products));
    }
  }, [slug]);
  
  // Render store page
}
```

---

## ⚠️ Key Considerations

### 1. Authentication & Authorization

**Seller App:**
- JWT token stored securely
- Token refresh mechanism
- Auto-logout on token expiry
- Protected routes

**Customer Website:**
- No authentication required (public)
- Order tracking uses phone number + order ID
- Optional: Customer accounts for order history

### 2. API Error Handling

```typescript
const handleApiError = (error: any) => {
  if (error.status === 401) {
    // Unauthorized - logout user
    logout();
  } else if (error.status === 403) {
    // Forbidden - show error message
    showError('You do not have permission');
  } else if (error.status === 404) {
    // Not found
    showError('Resource not found');
  } else if (error.status >= 500) {
    // Server error
    showError('Server error. Please try again later');
  } else {
    // Other errors
    showError(error.message || 'An error occurred');
  }
};
```

### 3. Loading States

Always show loading indicators:
```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await apiCall(url);
    // Process data
  } catch (error) {
    // Handle error
  } finally {
    setLoading(false);
  }
};
```

### 4. Data Caching

Consider caching strategies:
- Cache product lists
- Cache store information
- Invalidate cache on updates

### 5. Image Handling

**Product Images:**
- Backend should return image URLs
- Handle image loading errors
- Use placeholders for missing images
- Optimize images (compression, CDN)

### 6. Real-time Updates

**Consider WebSockets for:**
- New order notifications (seller app)
- Order status updates (customer website)
- Stock updates

### 7. Payment Integration

**Payment Methods:**
- Cash on Delivery (COD)
- Online Payment Gateway (Razorpay, Stripe, etc.)
- UPI

**Backend should handle:**
- Payment verification
- Payment status updates
- Refund processing

### 8. Shipping Integration

**Shipping Features:**
- Delivery address validation
- Shipping cost calculation
- Delivery time estimation
- Tracking integration

---

## 🧪 Testing Strategy

### 1. API Integration Testing

**Test each endpoint:**
```typescript
// Test file: Frontend/src/services/__tests__/api.test.ts

describe('Products API', () => {
  it('should fetch all products', async () => {
    const products = await productsAPI.getAll();
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
  });
  
  it('should create a product', async () => {
    const newProduct = {
      name: 'Test Product',
      price: 100,
      // ... other fields
    };
    const created = await productsAPI.create(newProduct);
    expect(created.id).toBeDefined();
  });
});
```

### 2. Component Testing

Test components with API integration:
```typescript
// Mock API responses
jest.mock('../services/api', () => ({
  productsAPI: {
    getAll: jest.fn(() => Promise.resolve({ products: [...] })),
  },
}));
```

### 3. End-to-End Testing

Test complete user flows:
- Seller signup → Add product → Receive order
- Customer visits store → Adds to cart → Places order

---

## 📝 Integration Checklist

When you receive the backend:

- [ ] **Analyze Backend Structure**
  - [ ] Review all controllers (API endpoints)
  - [ ] Understand data models
  - [ ] Check authentication mechanism
  - [ ] Review DTOs (request/response structures)

- [ ] **Document APIs**
  - [ ] List all endpoints
  - [ ] Document request/response formats
  - [ ] Note authentication requirements
  - [ ] Document error responses

- [ ] **Update API Configuration**
  - [ ] Set API base URL
  - [ ] Configure authentication headers
  - [ ] Set up error handling

- [ ] **Integrate Authentication**
  - [ ] Update signup flow
  - [ ] Update login flow
  - [ ] Implement token storage
  - [ ] Add token refresh logic

- [ ] **Integrate Products**
  - [ ] Replace mock data with API calls
  - [ ] Implement create/update/delete
  - [ ] Handle image uploads
  - [ ] Add error handling

- [ ] **Integrate Orders**
  - [ ] Fetch orders from API
  - [ ] Update order status
  - [ ] Handle order notifications

- [ ] **Integrate Analytics**
  - [ ] Replace mock data
  - [ ] Implement real-time updates
  - [ ] Add loading states

- [ ] **Create Customer Website**
  - [ ] Set up project structure
  - [ ] Implement store page
  - [ ] Implement product browsing
  - [ ] Implement cart and checkout
  - [ ] Implement order tracking

- [ ] **Testing**
  - [ ] Test all API integrations
  - [ ] Test error scenarios
  - [ ] Test loading states
  - [ ] Test authentication flows

- [ ] **Deployment**
  - [ ] Configure production API URLs
  - [ ] Set up environment variables
  - [ ] Deploy backend
  - [ ] Deploy customer website
  - [ ] Deploy mobile app

---

## 🚀 Next Steps

1. **Wait for Backend Team** to provide complete backend folder
2. **Analyze Backend APIs** - Document all endpoints
3. **Update Frontend** - Replace mock data with real API calls
4. **Create Customer Website** - Build static website for customers
5. **Test Integration** - Test all features end-to-end
6. **Deploy** - Deploy all three components

---

## 📞 Support

When integrating:
- Keep backend team in loop for API changes
- Document any issues or missing endpoints
- Test thoroughly before deployment
- Use version control (Git) for all changes

---

**Last Updated**: 2025-11-27

