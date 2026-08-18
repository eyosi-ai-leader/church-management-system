# Authentication Architecture Documentation

## Church Management System (CHMS)

### Sprint 1 – Authentication Foundation

---

# Purpose

This document explains how the Authentication module is designed, why each layer exists, and how requests flow through the backend.

The goal is to understand the architecture instead of memorizing code.

---

# Backend Technology Stack

* Node.js
* Express.js
* MySQL (mysql2)
* JWT (jsonwebtoken)
* bcrypt
* express-validator
* Helmet
* Morgan
* CORS
* Cookie Parser
* dotenv

---

# Project Architecture

We follow a layered architecture.

Each layer has one responsibility.

```
Client
    │
    ▼
Routes
    │
    ▼
Validators
    │
    ▼
Controllers
    │
    ▼
Services
    │
    ▼
Models
    │
    ▼
MySQL Database
```

This keeps the project clean, reusable, and easy to maintain.

---

# Current Folder Structure

```
backend/

src/

config/
    env.js
    db.js

controllers/
    authController.js

middleware/

models/
    userModel.js

routes/
    authRoutes.js
    healthRoutes.js

services/
    authService.js

utils/
    jwt.js
    password.js
    response.js

validators/
    authValidator.js

app.js
server.js
```

---

# Request Flow

Example:

```
POST /api/auth/register
```

The request travels through the backend in this order:

```
Client

↓

authRoutes.js

↓

authValidator.js

↓

authController.js

↓

authService.js

↓

userModel.js

↓

MySQL

↓

Controller

↓

JSON Response

↓

Client
```

Every request follows this same pattern.

---

# Layer Responsibilities

## 1. Routes

File:

```
routes/authRoutes.js
```

Purpose:

* Define API endpoints.
* Connect URLs to controllers.
* Attach validation middleware.

Example:

```
POST /register
POST /login
```

Routes should never contain business logic or SQL queries.

---

## 2. Validators

File:

```
validators/authValidator.js
```

Purpose:

Validate incoming data before it reaches the controller.

Examples:

* Required fields
* Email format
* Password length
* Password confirmation

If validation fails:

* Controller is never executed.
* Database is never queried.

This protects the application from invalid data.

---

## 3. Controllers

File:

```
controllers/authController.js
```

Purpose:

Handle HTTP requests and responses.

Controller responsibilities:

* Receive request
* Check validation result
* Call the appropriate service
* Return JSON response

Controllers should remain thin.

They should not:

* Write SQL
* Hash passwords
* Generate JWTs
* Implement business rules

---

## 4. Services

File:

```
services/authService.js
```

Purpose:

Contain all business logic.

Current Register Logic:

1. Receive user data
2. Check whether email already exists
3. Hash password
4. Assign default Member role
5. Save user
6. Return user information

Current Login Logic:

1. Find user by email
2. Compare password with bcrypt
3. Generate JWT
4. Return authenticated user and token

Services never return HTTP responses.

They only return data.

---

## 5. Models

File:

```
models/userModel.js
```

Purpose:

Communicate with MySQL.

Current functions:

```
findUserByEmail()

createUser()

findUserById()
```

Models should only perform database operations.

They should not contain business rules.

---

## 6. Utilities

### password.js

Purpose:

Centralize password functions.

Functions:

```
hashPassword()

comparePassword()
```

This prevents duplicate bcrypt code.

---

### jwt.js

Purpose:

Generate JWT tokens after successful login.

Current payload:

```
{
    id,
    roleId,
    email
}
```

The token is returned to the frontend after successful authentication.

---

### response.js

Purpose:

Standardize API responses.

Success format:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

Error format:

```json
{
  "success": false,
  "message": "...",
  "errors": []
}
```

Using one consistent response structure makes frontend integration easier.

---

# Database Tables Used

Current authentication tables:

```
roles

permissions

role_permissions

users
```

Currently implemented:

* users
* roles

Permissions and RBAC will be connected later.

---

# Registration Flow

```
Frontend

↓

POST /api/auth/register

↓

Route

↓

Validator

↓

Controller

↓

Service

↓

Check duplicate email

↓

Hash password

↓

Assign Member role

↓

Model

↓

Insert into users table

↓

Return success response

↓

Frontend
```

---

# Login Flow

```
Frontend

↓

POST /api/auth/login

↓

Route

↓

Validator

↓

Controller

↓

Service

↓

Find user

↓

Compare password

↓

Generate JWT

↓

Return token

↓

Frontend
```

---

# Design Principles

This project follows these principles:

### Separation of Concerns

Each layer performs only one responsibility.

---

### Single Responsibility Principle (SRP)

One file should have one primary purpose.

---

### Reusability

Reusable utilities include:

* Password helper
* JWT helper
* Response helper

---

### Maintainability

Keeping controllers, services, and models separate makes the project easier to modify and debug.

---

### Scalability

The same architecture will be reused for:

* Members
* Ministries
* Events
* Sermons
* Prayer Requests
* Donations
* Attendance
* Notifications
* Reports
* Dashboard

---

# Authentication Module Status

Completed:

* Project structure
* Express setup
* Environment configuration
* MySQL connection
* Health API
* Authentication routes
* Validation
* Controllers
* Services
* Models
* Password hashing
* User registration
* User login
* JWT generation

---

# Next Steps

The next authentication tasks are:

1. JWT Authentication Middleware
2. Protected Routes
3. Role-Based Access Control (RBAC)
4. Logout
5. Forgot Password
6. Reset Password
7. Connect the Next.js Login page
8. Connect the Next.js Register page

After authentication is complete, development will continue with the Member Management module.

---

# Key Takeaway

Whenever you build a new backend feature, follow the same architecture:

```
Route
    ↓
Validator
    ↓
Controller
    ↓
Service
    ↓
Model
    ↓
Database
```

If you consistently follow this structure, your codebase will remain clean, scalable, and maintainable as the Church Management System grows.
