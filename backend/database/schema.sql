-- ==========================================
-- Church Platform (CHMS)
-- Authentication Schema
-- ==========================================

-- Remove tables if they already exist
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS roles;

-- ==========================================
-- Roles
-- ==========================================

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(50) NOT NULL UNIQUE,

    description VARCHAR(255),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- Permissions
-- ==========================================

CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    description VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Role Permissions
-- ==========================================

CREATE TABLE role_permissions (

    role_id INT NOT NULL,

    permission_id INT NOT NULL,

    PRIMARY KEY (role_id, permission_id),

    CONSTRAINT fk_role_permissions_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_role_permissions_permission
        FOREIGN KEY (permission_id)
        REFERENCES permissions(id)
        ON DELETE CASCADE
);

-- ==========================================
-- Users
-- ==========================================

CREATE TABLE users (

    id INT AUTO_INCREMENT PRIMARY KEY,

    role_id INT NOT NULL,

    first_name VARCHAR(100) NOT NULL,

    last_name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    phone VARCHAR(30),

    profile_image VARCHAR(255),

    email_verified BOOLEAN DEFAULT FALSE,

    is_active BOOLEAN DEFAULT TRUE,

    last_login TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
);