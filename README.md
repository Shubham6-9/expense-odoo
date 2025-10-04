# Expense Odoo API

A Node.js/Express API for expense management with user authentication and company administration.

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the root directory with the following variables:

   ```env
   MONGO_URI=mongodb://localhost:27017/expense-odoo
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   BCRYPT_ROUNDS=10
   TEMP_PW_EXPIRES_HOURS=24
   PORT=5000
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your system.

4. **Start the server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

#### Admin Authentication

- `POST /api/auth/admin/signup` - Create company admin
- `POST /api/auth/admin/login` - Login as admin
- `GET /api/auth/admin/profile` - Get admin profile (protected)

#### User Authentication

- `POST /api/auth/user/login` - Login as user

### User Management

#### Create Users (Admin only)

- `POST /api/users/admin-create` - Company admin creates user
- `POST /api/users/` - User admin creates user (requires user auth)

### Dashboard Endpoints

- `GET /api/dashboard/admin` - Get admin dashboard (admin auth required)
- `GET /api/dashboard/user` - Get user dashboard (user auth required)
- `GET /api/dashboard/` - Auto-detect dashboard type (legacy)

### Other Endpoints

- `GET /api/approval-rules/` - List approval rules

## Testing Create User Functionality

1. **Start the server:**

   ```bash
   npm run dev
   ```

2. **Run the test script:**

   ```bash
   node test-create-user.js
   ```

3. **Check server logs** for the temporary password when a user is created.

## Usage Example

### 1. Create Admin

```bash
curl -X POST http://localhost:5000/api/auth/admin/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Admin",
    "email": "admin@company.com",
    "password": "password123",
    "countryCode": "US",
    "currencyCode": "USD",
    "currencySign": "$"
  }'
```

### 2. Login as Admin

```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "password123"
  }'
```

### 3. Create User (using admin token)

```bash
curl -X POST http://localhost:5000/api/users/admin-create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Jane Employee",
    "email": "jane@company.com",
    "role": "Employee"
  }'
```

### 4. Get Admin Dashboard

```bash
curl -X GET http://localhost:5000/api/dashboard/admin \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 5. Get User Dashboard

```bash
curl -X GET http://localhost:5000/api/dashboard/user \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

## Project Structure

```
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── auth.controller.js    # Authentication logic
│   ├── user.controller.js    # User management
│   └── ...
├── middlewares/
│   ├── auth.middleware.js    # Authentication middleware
│   └── role.middleware.js    # Role-based access control
├── models/
│   ├── User.js              # User model
│   ├── Company.js           # Company model
│   ├── companyAdmin.model.js # Admin model
│   └── ...
├── routes/
│   ├── auth.routes.js       # Authentication routes
│   ├── user.routes.js       # User management routes
│   └── ...
└── server.js                # Main server file
```

## Dashboard API Details

### Admin Dashboard (`GET /api/dashboard/admin`)

Returns comprehensive data for company admins including:

**Response Structure:**

```json
{
  "message": "Admin dashboard data retrieved successfully",
  "data": {
    "admin": {
      "id": "admin_id",
      "name": "Admin Name",
      "email": "admin@company.com",
      "countryCode": "US",
      "currencyCode": "USD",
      "currencySign": "$",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "company": {
      "id": "company_id",
      "name": "Company Name",
      "countryCode": "US",
      "currencyCode": "USD",
      "currencySign": "$",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "statistics": {
      "users": {
        "total": 10,
        "byRole": {
          "Admin": 1,
          "Manager": 2,
          "Employee": 7
        },
        "newThisMonth": 3,
        "pendingPasswordChange": 2
      },
      "expenses": {
        "total": 25,
        "recent": [...]
      },
      "approvalRules": 3
    },
    "users": {
      "all": [...],
      "recent": [...]
    }
  }
}
```

### User Dashboard (`GET /api/dashboard/user`)

Returns role-specific data for regular users:

**For Employees:**

- Personal expense data
- Expense statistics (pending, approved, rejected)

**For Managers:**

- Team members
- Pending approvals
- Team expenses
- Team statistics

**For User Admins:**

- All company users
- All company expenses
- Approval rules
- User statistics

## Features

- ✅ Company admin registration and authentication
- ✅ User creation by company admins
- ✅ Role-based access control (Admin, Manager, Employee)
- ✅ Temporary password generation for new users
- ✅ JWT-based authentication
- ✅ MongoDB integration
- ✅ Input validation and error handling
- ✅ Comprehensive dashboard API with admin and user views
- ✅ User statistics and company analytics

## Notes

- Temporary passwords are logged to the console (check server logs)
- Email functionality is commented out but can be implemented later
- All routes are properly protected with authentication middleware
- Users are scoped to their respective companies
