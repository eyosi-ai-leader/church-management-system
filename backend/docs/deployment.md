# Church Management System (CHMS)

# Deployment Documentation

**Project:** Church Platform (CHMS)

**Document:** Backend Deployment Guide

**Version:** 1.0

**Backend Stack:**

* Node.js
* Express.js
* MySQL
* JWT Authentication

**Architecture:**

Production-ready REST API Architecture

---

# Table of Contents

1. Deployment Overview
2. Development Environment
3. Production Environment
4. Environment Variables
5. Local Development Setup
6. Production Configuration
7. Database Deployment
8. Backend Deployment Steps
9. Frontend Deployment Integration
10. Security Configuration
11. Backup Strategy
12. Database Recovery
13. Monitoring and Logging
14. Deployment Checklist
15. Future Infrastructure Improvements

---

# 1. Deployment Overview

The Church Management System is designed to run in different environments:

## Development Environment

Used by developers while building features.

Example:

```text
Developer Computer

↓

Node.js Server

↓

Local MySQL Database
```

---

## Production Environment

Used by real church users.

Example:

```text
Users

↓

Next.js Frontend

↓

Production API Server

↓

Production Database
```

---

# 2. Development Environment

Current development tools:

## Required Software

Install:

* Node.js
* npm
* Git
* MySQL / MariaDB
* VS Code
* Postman

---

## Development Structure

```text
Frontend

localhost:3000


Backend

localhost:5000


Database

localhost:3306
```

---

# 3. Production Environment

A production deployment requires:

## Frontend Server

Responsible for:

* User interface
* Public website
* Member dashboard

Example platforms:

* Vercel
* Netlify
* Cloud hosting

---

## Backend Server

Responsible for:

* APIs
* Authentication
* Business logic

Possible platforms:

* AWS
* DigitalOcean
* Azure
* VPS Server

---

## Database Server

Responsible for:

* User data
* Church data
* Transactions

Possible options:

* Managed MySQL
* Cloud Database
* Dedicated Database Server

---

# 4. Environment Variables

Environment variables store sensitive configuration.

Never hardcode:

* Passwords
* API keys
* Database credentials
* JWT secrets

---

Current development `.env`:

```env
PORT=5000

NODE_ENV=development


DB_HOST=localhost

DB_PORT=3306

DB_USER=root

DB_PASSWORD=

DB_NAME=church_platform


JWT_SECRET=my_secret_key

JWT_EXPIRES_IN=1d
```

---

# Production Environment Example

Production `.env`:

```env
PORT=5000

NODE_ENV=production


DB_HOST=production_database_host

DB_PORT=3306

DB_USER=production_user

DB_PASSWORD=strong_password

DB_NAME=church_platform


JWT_SECRET=strong_random_secret

JWT_EXPIRES_IN=1d
```

---

# Important Rules

Never upload `.env` to GitHub.

Add:

```
.env
```

inside:

```
.gitignore
```

---

# 5. Local Development Setup

## Step 1: Clone Project

Example:

```bash
git clone project-url
```

---

## Step 2: Install Dependencies

Backend:

```bash
npm install
```

Frontend:

```bash
npm install
```

---

## Step 3: Configure Environment

Create:

```
.env
```

Add database configuration.

---

## Step 4: Create Database

Example:

```sql
CREATE DATABASE church_platform;
```

---

## Step 5: Import Database Schema

Import:

```
schema.sql
```

Then:

```
seed.sql
```

---

## Step 6: Start Backend

Development:

```bash
npm run dev
```

Expected:

```text
MySQL Connected Successfully

Server running on port 5000
```

---

## Step 7: Start Frontend

```bash
npm run dev
```

Frontend:

```
localhost:3000
```

---

# 6. Production Configuration

Before deployment:

Change:

```env
NODE_ENV=production
```

---

Enable:

* Secure cookies
* HTTPS
* Strong JWT secret
* Production database

---

Example:

```env
JWT_SECRET=random-long-secure-string
```

A production JWT secret should never be:

```
my_secret_key
```

---

# 7. Database Deployment

Production database process:

## Step 1

Create production database.

Example:

```sql
CREATE DATABASE church_platform;
```

---

## Step 2

Import schema:

```bash
mysql -u username -p database_name < schema.sql
```

---

## Step 3

Import initial data:

```bash
mysql -u username -p database_name < seed.sql
```

---

## Step 4

Verify tables:

```sql
SHOW TABLES;
```

Expected:

```text
roles

permissions

role_permissions

users
```

---

# 8. Backend Deployment Steps

## Step 1: Prepare Server

Install:

* Node.js
* npm
* MySQL client

---

## Step 2: Upload Code

Example:

```bash
git clone repository
```

---

## Step 3: Install Packages

```bash
npm install
```

---

## Step 4: Configure Environment

Create production:

```
.env
```

---

## Step 5: Test Application

Run:

```bash
npm start
```

---

## Step 6: Use Process Manager

For production:

Use:

* PM2

Example:

```bash
pm2 start src/server.js
```

Benefits:

* Automatic restart
* Process monitoring
* Better reliability

---

# 9. Frontend Deployment Integration

Frontend environment:

Example:

```
.env.local
```

Contains:

```env
NEXT_PUBLIC_API_URL=https://api.churchplatform.com
```

---

Frontend API request:

Example:

```javascript
fetch(
`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`
)
```

---

Communication:

```text
Next.js

↓

HTTPS Request

↓

Express API

↓

MySQL
```

---

# 10. Security Configuration

Production security requirements:

---

## HTTPS

Always use HTTPS.

Protects:

* Login credentials
* JWT tokens
* User data

---

## Helmet

Already installed.

Purpose:

Adds security headers.

---

## CORS

Production example:

Allow only trusted frontend:

```javascript
cors({
origin:"https://churchwebsite.com"
})
```

---

## Password Security

Always:

* bcrypt hashing
* Never store plain passwords

---

## Database Security

Use:

* Strong database password
* Limited database user permissions
* Firewall protection

---

## Rate Limiting

Future improvement:

Prevent:

* Brute force attacks
* API abuse

---

# 11. Backup Strategy

Database backups are critical.

Church data includes:

* Members
* Attendance
* Donations
* Events
* Messages

---

# Backup Types

## Daily Backup

Automatic database backup every day.

---

Example:

```bash
mysqldump church_platform > backup.sql
```

---

## Weekly Backup

Store weekly copies.

---

## Monthly Backup

Long-term archive.

---

# Backup Storage

Possible locations:

* Cloud storage
* External server
* Backup service

Never store only one copy.

---

# 12. Database Recovery

If database fails:

## Step 1

Create database.

```sql
CREATE DATABASE church_platform;
```

---

## Step 2

Restore backup.

```bash
mysql church_platform < backup.sql
```

---

## Step 3

Verify:

```sql
SHOW TABLES;
```

---

# 13. Monitoring and Logging

Production systems require monitoring.

---

## Application Logs

Current:

Morgan middleware

Tracks:

* Requests
* Errors
* Status codes

---

## Future Logging

Add:

* Winston
* Error tracking
* Monitoring dashboards

---

## Monitor:

* Server uptime
* Database health
* API response time
* Errors
* Storage usage

---

# 14. Deployment Checklist

Before going live:

## Backend

✅ Environment variables configured

✅ Database connected

✅ JWT secret changed

✅ HTTPS enabled

✅ Error handling tested

✅ API tested

---

## Database

✅ Production database created

✅ Schema imported

✅ Backup configured

✅ User permissions configured

---

## Frontend

✅ API URL updated

✅ Production build tested

✅ Authentication tested

---

## Security

✅ Password hashing enabled

✅ CORS configured

✅ Helmet enabled

✅ Sensitive files protected

---

# 15. Future Infrastructure Improvements

As CHMS grows:

## Containerization

Add:

* Docker
* Docker Compose

---

## CI/CD

Automate:

* Testing
* Deployment
* Version control

---

## Cloud Architecture

Future:

```text
Users

↓

CDN

↓

Frontend Server

↓

API Server

↓

Database Server

↓

Backup Storage
```

---

## Advanced Features

Future:

* Redis caching
* Load balancing
* Database replication
* Monitoring system
* Automated backups

---

# Final Conclusion

The deployment process transforms the CHMS from a development project into a reliable production system.

A successful deployment requires:

* Correct environment configuration
* Secure database setup
* Protected APIs
* Reliable backups
* Monitoring
* Maintenance strategy

The goal is not only to build the application but also to operate it professionally and safely as the church platform grows.
