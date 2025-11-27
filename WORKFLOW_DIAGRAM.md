# 🔄 Complete Project Workflow

## Visual Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    SELLER ONBOARDING FLOW                       │
└─────────────────────────────────────────────────────────────────┘

1. Seller Downloads Mobile App
   │
   ▼
2. Seller Opens App → Sees Login/Signup Screen
   │
   ▼
3. Seller Signs Up
   ├── Enters: Full Name, Phone, Password
   ├── Backend: Creates User Account (disabled)
   └── Backend: Sends OTP via SMS
   │
   ▼
4. Seller Verifies OTP
   ├── Enters OTP Code
   ├── Backend: Verifies OTP
   └── Backend: Activates Account
   │
   ▼
5. Onboarding Flow (First Time)
   ├── Store Name
   ├── Business Information
   ├── Location Details
   ├── Product Categories
   └── Store Policies
   │
   ▼
6. Backend Creates Store
   ├── Store Profile
   ├── Store Settings
   ├── Unique Store URL: sakhi.com/store/{store-slug}
   └── Generates Customer Website
   │
   ▼
7. Seller Lands on Home Dashboard
   └── Can now manage store
```

---

```
┌─────────────────────────────────────────────────────────────────┐
│                  SELLER STORE MANAGEMENT FLOW                    │
└─────────────────────────────────────────────────────────────────┘

Seller Mobile App
│
├── 📦 CATALOG MANAGEMENT
│   │
│   ├── Add Product
│   │   ├── Product Details (name, price, description)
│   │   ├── Upload Images
│   │   ├── Select Category
│   │   ├── Set Stock
│   │   └── Backend: Creates Product
│   │
│   ├── Edit Product
│   │   └── Backend: Updates Product
│   │
│   ├── Delete Product
│   │   └── Backend: Deletes Product
│   │
│   ├── Manage Categories
│   │   └── Backend: CRUD Categories
│   │
│   └── Create Collections
│       └── Backend: Creates Product Collections
│
├── 📋 ORDER MANAGEMENT
│   │
│   ├── View Orders
│   │   ├── Backend: Fetches Orders
│   │   └── Filter by Status
│   │
│   ├── Accept Order
│   │   ├── Seller: Taps "Accept"
│   │   └── Backend: Updates Order Status
│   │
│   ├── Reject Order
│   │   └── Backend: Updates Order Status
│   │
│   ├── Mark as Shipped
│   │   └── Backend: Updates Order Status
│   │
│   └── Mark as Delivered
│       └── Backend: Updates Order Status
│
├── 📊 ANALYTICS
│   │
│   ├── View Sales Reports
│   │   └── Backend: Returns Sales Data
│   │
│   ├── View Customer Insights
│   │   └── Backend: Returns Customer Data
│   │
│   └── View Product Performance
│       └── Backend: Returns Product Analytics
│
└── ⚙️ SETTINGS
    │
    ├── Store Appearance
    │   └── Backend: Updates Store Settings
    │
    ├── Payment Settings
    │   └── Backend: Updates Payment Config
    │
    ├── Shipping Settings
    │   └── Backend: Updates Shipping Config
    │
    └── Share Store Link
        └── Opens: sakhi.com/store/{store-slug}
```

---

```
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOMER SHOPPING FLOW                       │
└─────────────────────────────────────────────────────────────────┘

1. Customer Receives Store Link
   └── From Seller (via WhatsApp, SMS, etc.)
   │
   ▼
2. Customer Opens Link
   └── Opens: https://sakhi.com/store/{store-slug}
   │
   ▼
3. Customer Website Loads
   ├── Backend: Fetches Store Info by Slug
   ├── Backend: Fetches Store Products
   └── Displays Store Homepage
   │
   ▼
4. Customer Browses Products
   ├── View by Categories
   ├── Search Products
   ├── Filter Products
   └── View Product Details
   │
   ▼
5. Customer Adds to Cart
   ├── Selects Products
   ├── Updates Quantities
   └── Cart Stored Locally (or Backend)
   │
   ▼
6. Customer Proceeds to Checkout
   ├── Review Cart
   ├── Enter Delivery Address
   ├── Select Payment Method
   └── Place Order
   │
   ▼
7. Order Created
   ├── Backend: Creates Order
   ├── Backend: Sends Notification to Seller
   ├── Backend: Sends Confirmation to Customer
   └── Customer: Receives Order Number
   │
   ▼
8. Seller Processes Order (Mobile App)
   ├── Sees New Order Notification
   ├── Accepts/Rejects Order
   ├── Updates Order Status
   └── Marks as Shipped/Delivered
   │
   ▼
9. Customer Tracks Order (Website)
   ├── Enters Order Number + Phone
   ├── Backend: Returns Order Status
   └── Views Order Updates
```

---

## 🔄 Data Flow Between Components

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  Seller App  │────────▶│  Backend API  │◀────────│Customer Website
│ (React Native)│  HTTP   │ (Spring Boot) │  HTTP   │  (React/Next)
└──────────────┘         └───────┬───────┘         └──────────────┘
                                  │
                                  │ SQL Queries
                                  ▼
                          ┌──────────────┐
                          │  PostgreSQL  │
                          │   Database   │
                          └──────────────┘
```

### Request Flow Example: Adding a Product

```
1. Seller App
   │
   ├── User fills product form
   ├── Taps "Save"
   └── Calls: productsAPI.create(productData)
   │
   ▼
2. HTTP Request
   │
   ├── Method: POST
   ├── URL: https://api.sakhi.com/api/products
   ├── Headers: 
   │   ├── Authorization: Bearer {JWT_TOKEN}
   │   └── Content-Type: application/json
   └── Body: { name, price, description, ... }
   │
   ▼
3. Backend API
   │
   ├── Validates JWT Token
   ├── Validates Request Data
   ├── Creates Product in Database
   └── Returns: { id, name, price, ... }
   │
   ▼
4. Response to Seller App
   │
   ├── Status: 200 OK
   └── Body: { product data }
   │
   ▼
5. Seller App Updates UI
   │
   └── Shows success message
   └── Refreshes product list
```

---

## 🔄 Order Flow Example

```
┌─────────────────────────────────────────────────────────────┐
│                    ORDER LIFECYCLE                          │
└─────────────────────────────────────────────────────────────┘

1. CUSTOMER PLACES ORDER
   │
   ├── Customer Website
   │   └── POST /api/orders
   │       └── { items, address, payment }
   │
   └── Backend
       ├── Creates Order (status: 'pending')
       ├── Sends Notification to Seller
       └── Returns Order Number to Customer
   │
   ▼
2. SELLER RECEIVES NOTIFICATION
   │
   ├── Seller App
   │   └── Shows: "New Order #12345"
   │
   └── Seller Views Order Details
   │
   ▼
3. SELLER ACCEPTS ORDER
   │
   ├── Seller App
   │   └── PUT /api/orders/{id}/status
   │       └── { status: 'accepted' }
   │
   └── Backend
       ├── Updates Order Status
       └── Sends Update to Customer (if tracking enabled)
   │
   ▼
4. SELLER PREPARES ORDER
   │
   ├── Seller App
   │   └── PUT /api/orders/{id}/status
   │       └── { status: 'pickup_ready' }
   │
   └── Backend Updates Status
   │
   ▼
5. SELLER SHIPS ORDER
   │
   ├── Seller App
   │   └── PUT /api/orders/{id}/status
   │       └── { status: 'shipped' }
   │
   └── Backend
       ├── Updates Status
       └── Sends Tracking Info to Customer
   │
   ▼
6. ORDER DELIVERED
   │
   ├── Seller App
   │   └── PUT /api/orders/{id}/status
   │       └── { status: 'delivered' }
   │
   └── Backend
       ├── Updates Status
       ├── Processes Payment (if COD)
       └── Marks Order Complete
```

---

## 🔄 Real-time Updates Flow

```
┌─────────────────────────────────────────────────────────────┐
│              REAL-TIME NOTIFICATIONS (Optional)              │
└─────────────────────────────────────────────────────────────┘

Option 1: Polling (Simple)
   │
   ├── Seller App polls every 30 seconds
   │   └── GET /api/orders?status=pending
   │
   └── Shows new orders when found

Option 2: WebSockets (Advanced)
   │
   ├── Seller App connects to WebSocket
   │
   ├── Backend sends push notification
   │   └── "New order #12345"
   │
   └── Seller App updates UI immediately
```

---

## 📱 Integration Points Summary

### Seller App → Backend

| Feature | API Endpoint | Method |
|---------|-------------|--------|
| Signup | `/api/auth/signup` | POST |
| Login | `/api/auth/login` | POST |
| Verify OTP | `/api/auth/verify-otp` | POST |
| Get Products | `/api/products` | GET |
| Create Product | `/api/products` | POST |
| Update Product | `/api/products/{id}` | PUT |
| Delete Product | `/api/products/{id}` | DELETE |
| Get Orders | `/api/orders` | GET |
| Update Order Status | `/api/orders/{id}/status` | PUT |
| Get Analytics | `/api/analytics/*` | GET |

### Customer Website → Backend

| Feature | API Endpoint | Method |
|---------|-------------|--------|
| Get Store by Slug | `/api/stores/{slug}` | GET |
| Get Store Products | `/api/stores/{storeId}/products` | GET |
| Get Product Details | `/api/products/{id}` | GET |
| Create Order | `/api/orders` | POST |
| Track Order | `/api/orders/{id}/track` | GET |

---

## 🎯 Key Integration Points

1. **Authentication**: JWT tokens for seller app
2. **Store Identification**: Store slug/ID for customer website
3. **Product Sync**: Same products visible in both app and website
4. **Order Sync**: Orders created on website appear in seller app
5. **Real-time Updates**: Order status changes reflect everywhere

---

**This workflow ensures seamless integration between all three components!**

