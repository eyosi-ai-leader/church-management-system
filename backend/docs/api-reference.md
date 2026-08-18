# Church Management System (CHMS)

# API Reference Documentation

**Project:** Church Platform (CHMS)

**API Version:** v1

**Backend:** Node.js + Express.js

**Database:** MySQL

**API Style:** REST API

---

# Table of Contents

1. API Overview
2. API Architecture
3. Base URL
4. HTTP Methods
5. Response Format
6. HTTP Status Codes
7. Authentication System
8. Authentication Endpoints
9. Register API
10. Login API
11. Health Check API
12. Protected Routes
13. Authorization Flow
14. Frontend Integration
15. Future API Modules

---

# 1. API Overview

The Church Management System uses REST APIs to allow communication between:

```text
Next.js Frontend

        |

        |

Express Backend

        |

        |

MySQL Database
```

The frontend never accesses the database directly.

All communication happens through secure API endpoints.

---

# 2. API Architecture

Request flow:

```text
Client

↓

API Route

↓

Controller

↓

Service

↓

Model

↓

Database

↓

Response
```

Example:

```text
POST /api/auth/login

↓

authRoutes.js

↓

authController.js

↓

authService.js

↓

userModel.js

↓

MySQL

↓

JSON Response
```

---

# 3. Base URL

Development:

```
http://localhost:5000
```

Example:

```
http://localhost:5000/api/auth/login
```

---

Future Production:

Example:

```
https://api.churchplatform.com
```

---

# 4. HTTP Methods

The API follows REST conventions.

| Method | Purpose              |
| ------ | -------------------- |
| GET    | Retrieve data        |
| POST   | Create new data      |
| PUT    | Update existing data |
| PATCH  | Partial update       |
| DELETE | Remove data          |

Examples:

```
GET /api/members

POST /api/events

PUT /api/users/1

DELETE /api/events/5
```

---

# 5. Standard Response Format

All APIs use a consistent JSON structure.

---

## Success Response

Example:

```json
{
    "success": true,
    "message": "Operation successful",
    "data": {}
}
```

---

## Error Response

Example:

```json
{
    "success": false,
    "message": "Something went wrong",
    "errors": null
}
```

---

# Why Use Standard Responses?

Because the frontend always knows what to expect.

Example:

```javascript
if(response.success){

   showSuccessMessage();

}else{

   showErrorMessage();

}
```

---

# 6. HTTP Status Codes

The API follows standard HTTP status codes.

---

## 200 OK

Request successful.

Example:

```text
Successful login
```

---

## 201 Created

New resource created.

Example:

```text
New user registered
```

---

## 400 Bad Request

Invalid input.

Example:

```text
Missing required field
```

---

## 401 Unauthorized

Authentication failed.

Example:

```text
Invalid JWT token
```

---

## 403 Forbidden

User does not have permission.

Example:

```text
Member trying to access admin page
```

---

## 404 Not Found

Resource does not exist.

Example:

```text
User not found
```

---

## 500 Internal Server Error

Unexpected server error.

---

# 7. Authentication System

The CHMS authentication system uses:

* JWT
* bcrypt
* Role-based authorization

Authentication flow:

```text
User

↓

Login

↓

Backend verifies credentials

↓

Generate JWT Token

↓

Frontend stores token

↓

Token sent with future requests

↓

Backend verifies token

↓

Access granted
```

---

# JWT Token

Example payload:

```json
{
    "id":3,
    "roleId":4,
    "email":"eyosi@example.com"
}
```

The token contains:

* User ID
* Role ID
* Email

The token does NOT contain:

* Password
* Sensitive information

---

# 8. Authentication Endpoints

Current authentication APIs:

| Method | Endpoint           | Purpose        |
| ------ | ------------------ | -------------- |
| POST   | /api/auth/register | Create account |
| POST   | /api/auth/login    | Login user     |

---

# 9. Register API

## Endpoint

```
POST /api/auth/register
```

Purpose:

Create a new user account.

---

## Request Body

Headers:

```
Content-Type: application/json
```

Body:

```json
{
    "firstName":"Eyosi",
    "lastName":"Michael",
    "email":"eyosi@example.com",
    "password":"Password123",
    "confirmPassword":"Password123"
}
```

---

# Backend Process

The backend performs:

1. Validate input
2. Check duplicate email
3. Hash password
4. Assign default role
5. Save user
6. Return response

---

# Successful Response

Status:

```
200 OK
```

Response:

```json
{
    "success":true,
    "message":"User registered successfully",
    "data":{
        "id":3,
        "firstName":"Eyosi",
        "lastName":"Michael",
        "email":"eyosi@example.com",
        "role":"Member"
    }
}
```

---

# Error Response

Example:

Duplicate email:

```json
{
    "success":false,
    "message":"Email already exists",
    "errors":null
}
```

---

# 10. Login API

## Endpoint

```
POST /api/auth/login
```

Purpose:

Authenticate existing users.

---

## Request Body

```json
{
    "email":"eyosi@example.com",
    "password":"Password123"
}
```

---

# Backend Process

The backend:

1. Finds user by email
2. Checks password
3. Compares bcrypt hash
4. Generates JWT
5. Returns token

---

# Successful Response

```json
{
    "success":true,
    "message":"Login successful",
    "data":{
        "user":{
            "id":3,
            "firstName":"Eyosi",
            "lastName":"Michael",
            "email":"eyosi@example.com",
            "roleId":4
        },
        "token":"eyJhbGciOiJIUzI1Ni..."
    }
}
```

---

# Login Errors

Wrong password:

```json
{
    "success":false,
    "message":"Invalid email or password"
}
```

Unknown user:

```json
{
    "success":false,
    "message":"Invalid email or password"
}
```

---

# 11. Health Check API

## Endpoint

```
GET /api/health
```

Purpose:

Check whether the server is running.

---

Response:

```json
{
    "success":true,
    "message":"API is running"
}
```

---

# 12. Protected Routes

Protected routes require JWT authentication.

Example:

```
GET /api/profile
```

Request header:

```
Authorization: Bearer TOKEN
```

Example:

```
Authorization: Bearer eyJhbGciOiJIUzI1...
```

---

# Authentication Middleware

The middleware:

1. Reads token
2. Verifies JWT
3. Extracts user information
4. Allows access

Flow:

```text
Request

↓

JWT Middleware

↓

Verify Token

↓

Attach User

↓

Controller
```

---

# 13. Role-Based Authorization (Future)

The system supports:

```
roles

permissions

role_permissions
```

Example:

Admin:

```
CREATE_USER
DELETE_USER
MANAGE_EVENTS
VIEW_REPORTS
```

Member:

```
VIEW_PROFILE
JOIN_MINISTRY
REGISTER_EVENT
```

---

# Authorization Flow

```text
User Request

↓

JWT Verification

↓

Check User Role

↓

Check Permission

↓

Allow / Deny
```

---

# 14. Frontend Integration

The Next.js frontend will consume these APIs.

Example:

Login page:

```javascript
fetch(
"http://localhost:5000/api/auth/login",
{
 method:"POST",
 headers:{
 "Content-Type":"application/json"
 },
 body:JSON.stringify(data)
}
)
```

Response:

```javascript
{
 token,
 user
}
```

Frontend stores authentication state.

---

# 15. Future API Modules

The CHMS will expand with:

---

# Member APIs

Future:

```
GET /api/members

POST /api/members

PUT /api/members/:id

DELETE /api/members/:id
```

---

# Ministry APIs

Future:

```
GET /api/ministries

POST /api/ministries

POST /api/ministries/:id/join
```

---

# Event APIs

Future:

```
GET /api/events

POST /api/events

POST /api/events/:id/register
```

---

# Sermon APIs

Future:

```
GET /api/sermons

POST /api/sermons

PUT /api/sermons/:id
```

---

# Prayer Request APIs

Future:

```
POST /api/prayers

GET /api/prayers

PUT /api/prayers/:id/status
```

---

# Finance APIs

Future:

```
GET /api/donations

POST /api/donations

GET /api/reports
```

---

# Notification APIs

Future:

```
POST /api/notifications

GET /api/notifications
```

---

# API Development Workflow

Every new API follows:

```text
Database Design

↓

Model

↓

Service

↓

Controller

↓

Route

↓

Postman Testing

↓

Frontend Integration
```

---

# API Security Checklist

Before production:

* Validate all inputs
* Hash passwords
* Use JWT securely
* Add rate limiting
* Add logging
* Hide sensitive errors
* Use HTTPS
* Protect admin routes
* Backup database

---

# Conclusion

The CHMS API layer provides a structured communication system between the frontend and backend.

The current authentication APIs establish the security foundation of the platform.

All future modules will follow the same REST architecture:

```
Route

↓

Controller

↓

Service

↓

Model

↓

Database
```

This keeps the system scalable, maintainable, and ready to grow into a complete Church Management System.
