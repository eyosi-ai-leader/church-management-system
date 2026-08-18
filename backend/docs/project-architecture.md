# Church Management System (CHMS)

# Project Architecture Documentation

**Project Name:** Church Platform (CHMS)

**Version:** 1.0

**Backend Stack:** Node.js, Express.js, MySQL

**Frontend Stack:** Next.js, React, Tailwind CSS

**Architecture:** Layered Architecture (MVC + Service Layer)

**Author:** Eyosi

---

# Table of Contents

1. Project Overview
2. Project Vision
3. Technology Stack
4. High-Level System Architecture
5. Backend Architecture
6. Frontend Architecture
7. Backend Folder Structure
8. Frontend Folder Structure
9. Request Flow
10. Authentication Flow
11. Layer Responsibilities
12. Design Principles
13. Module Roadmap
14. Development Workflow
15. Coding Standards
16. Future Improvements
17. Conclusion

---

# 1. Project Overview

The Church Management System (CHMS) is a full-stack web application designed to help churches manage both their public website and internal operations.

The system is divided into two major parts:

* Public Website
* Church Management System

The public website allows visitors to learn about the church, ministries, events, sermons, and contact information.

The Church Management System provides secure features for members, leaders, pastors, and administrators after authentication.

The goal is to build a scalable, maintainable, and production-ready application.

---

# 2. Project Vision

The project will grow gradually.

```text
Public Website
        │
        ▼
Authentication
        │
        ▼
Member Dashboard
        │
        ▼
Admin Dashboard
        │
        ▼
Church Management System
        │
        ▼
AI Church Assistant
```

This roadmap allows the application to evolve without requiring major architectural changes.

---

# 3. Technology Stack

## Frontend

* Next.js (App Router)
* React
* JavaScript
* Tailwind CSS
* Lucide React
* Swiper.js

---

## Backend

* Node.js
* Express.js
* MySQL
* mysql2
* JWT
* bcrypt
* express-validator
* Helmet
* Morgan
* Cookie Parser
* CORS
* dotenv

---

## Database

* MySQL (MariaDB)
* Relational Database

---

## Development Tools

* VS Code
* Git
* GitHub
* Postman
* XAMPP

---

# 4. High-Level System Architecture

```text
                    Users
                      │
                      ▼
             Next.js Frontend
                      │
           HTTP / REST API
                      │
                      ▼
             Express Backend
                      │
        Business Logic Layer
                      │
                      ▼
                MySQL Database
```

The frontend never communicates directly with the database.

All communication passes through the backend API.

---

# 5. Backend Architecture

The backend follows a layered architecture.

```text
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
Database
```

Each layer has one responsibility.

This architecture keeps the project clean and maintainable.

---

# 6. Frontend Architecture

The frontend uses the Next.js App Router.

```text
User
 │
 ▼
Pages
 │
 ▼
Reusable Components
 │
 ▼
API Calls
 │
 ▼
Express Backend
```

Components focus only on UI and user interaction.

Business logic remains in the backend.

---

# 7. Backend Folder Structure

```text
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

validators/
    authValidator.js

utils/
    jwt.js
    password.js
    response.js

app.js
server.js

docs/
```

---

# Folder Responsibilities

## config/

Contains project configuration.

Examples:

* Environment variables
* Database connection

---

## routes/

Defines API endpoints.

Example:

```text
POST /api/auth/register
```

Routes never contain business logic.

---

## validators/

Validates incoming requests.

Examples:

* Email validation
* Password validation
* Required fields

Validation occurs before the controller.

---

## controllers/

Handle HTTP requests and responses.

Responsibilities:

* Receive requests
* Call services
* Return JSON responses

Controllers remain small.

---

## services/

Contains business logic.

Examples:

* Register user
* Login user
* Generate JWT
* Check duplicate email

Services never communicate directly with HTTP.

---

## models/

Responsible for database operations.

Examples:

* SELECT
* INSERT
* UPDATE
* DELETE

SQL belongs only here.

---

## middleware/

Processes requests before controllers.

Examples:

* Authentication
* Authorization
* Logging
* Error handling

---

## utils/

Reusable helper functions.

Current utilities:

* Password helper
* JWT helper
* Response helper

Future utilities:

* Email helper
* File upload helper
* Date helper

---

# 8. Frontend Folder Structure

```text
src/

app/

components/

shared/

layout/

hooks/

data/

styles/

lib/
```

---

# Folder Responsibilities

## app/

Contains application pages.

Examples:

* Home
* About
* Ministries
* Events
* Sermons
* Contact

---

## components/

Reusable UI components.

Examples:

* Navbar
* Footer
* Cards
* Forms
* Hero Sections

---

## hooks/

Reusable React hooks.

---

## data/

Temporary static data.

Later replaced by backend APIs.

---

# 9. Request Flow

Example:

User registers.

```text
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

Model

↓

Database

↓

Controller

↓

JSON Response

↓

Frontend
```

Every request in the project follows this architecture.

---

# 10. Authentication Flow

Register

```text
User

↓

Register Page

↓

POST /register

↓

Validate Input

↓

Check Email

↓

Hash Password

↓

Save User

↓

Success Response
```

---

Login

```text
User

↓

Login Page

↓

POST /login

↓

Find User

↓

Compare Password

↓

Generate JWT

↓

Return Token
```

---

Protected Routes

```text
Client

↓

JWT Token

↓

Authentication Middleware

↓

Controller

↓

Protected Resource
```

---

# 11. Layer Responsibilities

## Routes

Purpose

Connect endpoints to controllers.

Routes should never:

* Query the database
* Hash passwords
* Generate JWT

---

## Validators

Purpose

Ensure requests are valid.

Responsibilities

* Validate email
* Validate password
* Validate required fields

---

## Controllers

Purpose

Handle requests and responses.

Controllers should:

* Receive request
* Call service
* Return response

Controllers should not contain business logic.

---

## Services

Purpose

Business logic.

Responsibilities

* Registration
* Login
* Password hashing
* JWT generation

Services coordinate the application's rules.

---

## Models

Purpose

Database communication.

Responsibilities

* Read
* Insert
* Update
* Delete

Models never contain business decisions.

---

## Utilities

Purpose

Reusable helper functions.

Current helpers:

* JWT
* Password
* Response

---

# 12. Design Principles

## Separation of Concerns

Every layer has a different responsibility.

---

## Single Responsibility Principle

One file should perform one main job.

---

## Reusability

Common logic belongs in reusable utilities and services.

---

## Scalability

New modules should follow the same architecture.

---

## Maintainability

Small files are easier to debug and improve.

---

## Security

Passwords are hashed.

JWT secures authenticated requests.

Validation protects the API.

---

# 13. Module Roadmap

## Completed

* Public Website
* Backend Foundation
* Authentication Database
* Register API
* Login API

---

## In Progress

* JWT Authentication
* Protected Routes
* RBAC

---

## Planned Modules

Authentication

* Login
* Logout
* Forgot Password
* Reset Password

Members

* Member Profiles
* Families
* Profile Photos

Ministries

* Ministry Management
* Join Requests
* Leaders

Events

* Event CRUD
* Registration
* Attendance

Sermons

* Categories
* Media Upload
* Video Management

Prayer

* Prayer Requests
* Prayer Follow-up

Giving

* Donations
* Expenses
* Financial Reports

Communication

* Notifications
* Announcements

Administration

* Users
* Roles
* Permissions
* Reports
* Settings

Artificial Intelligence

* AI Church Assistant
* AI Search
* AI Sermon Recommendations

---

# 14. Development Workflow

Every backend feature follows the same process.

```text
Database

↓

Model

↓

Service

↓

Controller

↓

Route

↓

Postman Test

↓

Frontend Integration
```

Never skip a layer.

---

# 15. Coding Standards

Always use:

* async/await
* try/catch
* RESTful APIs
* Validation
* Modular code
* Reusable helpers
* Consistent JSON responses
* Meaningful variable names

Avoid:

* SQL inside controllers
* Business logic inside routes
* Duplicate code
* Large files with multiple responsibilities

---

# 16. Future Improvements

As the system grows, additional features will include:

* Refresh Tokens
* Email Verification
* Two-Factor Authentication (2FA)
* File Storage
* Audit Logs
* API Documentation (Swagger/OpenAPI)
* Docker Support
* Automated Testing
* CI/CD Pipelines
* Redis Caching
* Rate Limiting
* Monitoring and Logging

---

# 17. Conclusion

The Church Management System is designed as a long-term, production-ready platform rather than a simple website.

By separating responsibilities into Routes, Validators, Controllers, Services, Models, and Utilities, the project remains clean, maintainable, secure, and scalable.

Every new feature—whether Members, Ministries, Events, Attendance, Giving, or AI—should follow the same architecture and development workflow established during the Authentication module.

This consistency will make the codebase easier to understand, easier to test, and easier to extend as the system grows over time.
