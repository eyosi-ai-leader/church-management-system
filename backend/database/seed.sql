-- ==========================================
-- Church Platform (CHMS)
-- Authentication Seed Data
-- ==========================================

-- ==========================================
-- Roles
-- ==========================================

INSERT INTO roles (name, description) VALUES
('Admin', 'System Administrator with full access'),
('Pastor', 'Church Pastor'),
('Church Elder', 'Church Elder with operational member oversight'),
('Ministry Leader', 'Leader of a ministry'),
('Member', 'Regular church member');

-- ==========================================
-- Permissions
-- ==========================================

INSERT INTO permissions (name, description) VALUES
('manage_users', 'Create, update and delete users'),
('manage_roles', 'Manage user roles'),
('manage_members', 'Manage church members'),
('manage_ministries', 'Manage church ministries'),
('manage_events', 'Manage church events'),
('manage_sermons', 'Manage sermons'),
('manage_prayers', 'Manage prayer requests'),
('view_dashboard', 'Access dashboard');

-- ==========================================
-- Role Permissions
-- ==========================================

-- Admin (role_id = 1)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1,1),
(1,2),
(1,3),
(1,4),
(1,5),
(1,6),
(1,7),
(1,8);

-- Pastor (role_id = 2)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(2,3),
(2,5),
(2,6),
(2,7),
(2,8);

-- Church Elder (role_id = 3)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(3,3),
(3,8);

-- Ministry Leader (role_id = 4)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(4,4),
(4,5),
(4,8);

-- Member (role_id = 5)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(5,8);