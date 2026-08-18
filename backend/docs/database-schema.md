# Church Management System (CHMS)

# Database Schema Documentation

**Project:** Church Platform (CHMS)

**Database:** MySQL / MariaDB

**Version:** 1.0

**Architecture:** Relational Database Design

---

# Table of Contents

1. Database Overview
2. Database Design Goals
3. Database Architecture
4. Entity Relationship Diagram (ERD)
5. Naming Conventions
6. Authentication Database Design
7. Core Authentication Tables
8. Table Relationships
9. Constraints
10. Index Strategy
11. Future Database Modules
12. Database Security Practices
13. Database Development Workflow
14. Future Improvements

---

# 1. Database Overview

The Church Management System uses a relational database designed with MySQL.

The database is responsible for storing:

* User accounts
* Roles and permissions
* Member information
* Ministries
* Events
* Attendance
* Sermons
* Prayer requests
* Communication
* Financial records
* Reports

The database is designed to support both:

1. Public Website Content
2. Internal Church Management Operations

---

# 2. Database Design Goals

The database follows these principles:

## Scalability

The database must support growth from a small church website into a complete management system.

---

## Data Integrity

The database must prevent invalid data.

Examples:

* Duplicate emails
* Invalid relationships
* Missing required information

---

## Security

Sensitive information must be protected.

Examples:

* Passwords are never stored as plain text.
* User access is controlled by roles.

---

## Maintainability

Tables should be:

* Organized
* Normalized
* Easy to understand
* Easy to extend

---

# 3. Database Architecture

High-level database structure:

```
                    Authentication

                        

 Roles
   |
   |
 Users
   |
   |
 Members


 Church Management

 Ministries
     |
     |
 Ministry Members


 Events
     |
     |
 Event Registrations


 Services
     |
     |
 Attendance Records


 Sermons


 Communication


 Finance
```

---

# 4. Entity Relationship Diagram (ERD)

## Current Authentication ERD

```
+-------------+
|   roles     |
+-------------+
| id          |
| name        |
| description |
+-------------+
       |
       |
       | 1:M
       |
+-------------+
|   users     |
+-------------+
| id          |
| role_id     |
| first_name  |
| last_name   |
| email       |
| password    |
| is_active   |
+-------------+

```

Relationship:

```
roles 1 ---- many users
```

Meaning:

One role can belong to many users.

Example:

```
Member Role
     |
     |
----------------
User A
User B
User C
```

---

# 5. Naming Conventions

## Table Names

Use:

* lowercase
* plural names

Examples:

Correct:

```
users
members
events
sermons
```

Incorrect:

```
User
EventTable
MemberData
```

---

## Column Names

Use snake_case.

Examples:

```
first_name
created_at
role_id
member_status
```

Avoid:

```
firstName
createdDate
```

---

## Primary Keys

Every table uses:

```
id
```

Example:

```
users.id
events.id
members.id
```

---

## Foreign Keys

Foreign keys follow:

```
table_name_id
```

Examples:

```
role_id
user_id
member_id
event_id
```

---

# 6. Authentication Database Design

Authentication is the first implemented database module.

Authentication answers:

* Who is the user?
* What can the user access?
* What role does the user have?

---

# 7. Authentication Tables

## roles Table

Purpose:

Stores user roles.

Example roles:

```
Admin
Pastor
Leader
Member
Volunteer
```

Structure:

```
roles

id
name
description
created_at
updated_at
```

Example:

| id | name   |
| -- | ------ |
| 1  | Admin  |
| 2  | Pastor |
| 3  | Leader |
| 4  | Member |

---

# users Table

Purpose:

Stores authentication accounts.

This table handles login information.

Structure:

```
users

id
role_id
first_name
last_name
email
password
is_active
created_at
updated_at
```

Important fields:

## email

Used for login.

Must be unique.

Example:

```
eyosi@example.com
```

---

## password

Stores bcrypt hashed passwords.

Example:

Wrong:

```
Password123
```

Correct:

```
$2b$10$8Hjs82jd....
```

---

## role_id

Connects users with roles.

Example:

```
role_id = 4
```

means:

```
Member
```

---

# permissions Table

Purpose:

Stores available system permissions.

Examples:

```
CREATE_USER
DELETE_MEMBER
MANAGE_EVENTS
VIEW_REPORTS
```

Structure:

```
permissions

id
name
description
created_at
updated_at
```

---

# role_permissions Table

Purpose:

Connects roles and permissions.

This creates many-to-many relationships.

Structure:

```
role_permissions

id
role_id
permission_id
```

Example:

```
Admin

    |
    |
------------------
Create User
Delete User
Manage Events
View Reports
```

---

# 8. Table Relationships

## One-to-Many Relationship

Example:

Roles and Users

```
roles

1

|

many

users
```

A role can have many users.

A user has one role.

---

## Many-to-Many Relationship

Example:

Roles and Permissions

```
roles

many

|

many

permissions
```

Solved using:

```
role_permissions
```

---

# 9. Database Constraints

Constraints protect data integrity.

---

# Primary Key

Every table has:

```
PRIMARY KEY(id)
```

Example:

```
users.id
```

---

# Foreign Key

Maintains relationships.

Example:

```
users.role_id

references

roles.id
```

---

# Unique Constraint

Prevents duplicate values.

Example:

```
users.email UNIQUE
```

Two users cannot have the same email.

---

# Not Null Constraint

Required fields cannot be empty.

Example:

```
email NOT NULL
password NOT NULL
```

---

# Default Values

Example:

```
is_active DEFAULT true
```

New users are active by default.

---

# 10. Index Strategy

Indexes improve database searching speed.

---

## Email Index

Important because login searches by email.

Example:

```
users.email
```

Query:

```sql
SELECT *
FROM users
WHERE email='user@gmail.com';
```

An index makes this faster.

---

## Foreign Key Indexes

Important relationships:

```
users.role_id

members.user_id

events.created_by
```

---

## Created Date Indexes

Useful for:

* Reports
* Sorting
* Dashboard statistics

Examples:

```
created_at
```

---

# 11. Future Database Modules

The CHMS database will grow with additional modules.

---

# Member Management

Tables:

```
members

families

member_profiles
```

Purpose:

Store church member information.

Examples:

* Name
* Phone
* Address
* Family information
* Membership date

---

# Ministry Management

Tables:

```
ministries

ministry_members

ministry_leaders
```

Purpose:

Manage church ministries.

Examples:

* Youth Ministry
* Worship Team
* Children Ministry

---

# Attendance Management

Tables:

```
services

attendance_records
```

Purpose:

Track attendance.

Example:

Sunday Service:

```
Service ID: 10

Members:
John
Mary
Peter
```

---

# Event Management

Tables:

```
events

event_registrations
```

Purpose:

Manage:

* Conferences
* Meetings
* Programs

---

# Sermon Management

Tables:

```
sermons

sermon_media
```

Purpose:

Store:

* Titles
* Speakers
* Videos
* Audio
* Categories

---

# Prayer Management

Tables:

```
prayer_requests
```

Purpose:

Store prayer requests and follow-up information.

---

# Communication

Tables:

```
announcements

notifications
```

Purpose:

Church communication.

---

# Finance

Tables:

```
donations

expenses
```

Purpose:

Financial management.

---

# Leadership

Tables:

```
leaders

leadership_positions
```

Purpose:

Manage church leadership structure.

---

# 12. Database Security Practices

## Password Security

Never store plain passwords.

Always use:

```
bcrypt
```

---

## Least Privilege

Users should only access required information.

Example:

Member:

```
View own profile
```

Admin:

```
Manage everything
```

---

## Backup Strategy

Production database should have:

* Daily backups
* Recovery plan
* Backup testing

---

## Input Validation

Never trust user input.

Validate data before saving.

---

# 13. Database Development Workflow

When creating a new module:

Follow this order:

```
1. Design Tables

↓

2. Create SQL Schema

↓

3. Create Models

↓

4. Create Services

↓

5. Create Controllers

↓

6. Create Routes

↓

7. Test API

↓

8. Connect Frontend
```

---

# 14. Future Database Improvements

Future versions may include:

* Database migrations
* Automated backups
* Database monitoring
* Audit logs
* Soft deletes
* Advanced reporting tables
* Data analytics
* AI recommendation data

---

# Conclusion

The CHMS database is designed as the foundation of a scalable church management platform.

The authentication database establishes the security foundation through:

* Users
* Roles
* Permissions

Future modules will build on this foundation while maintaining the same principles:

* Clean relationships
* Data integrity
* Security
* Scalability
* Maintainability

A strong database design allows the entire CHMS application to grow from a website into a complete digital church platform.
