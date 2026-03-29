-- =============================
-- USERS
-- =============================
INSERT INTO user (id, name, email, email_verified, image, created_at, updated_at) VALUES
('u1', 'Alice', 'alice@example.com', true, NULL, NOW(), NOW()),
('u2', 'Bob', 'bob@example.com', true, NULL, NOW(), NOW()),
('u3', 'Charlie', 'charlie@example.com', false, NULL, NOW(), NOW()),
('u4', 'Diana', 'diana@example.com', true, NULL, NOW(), NOW()),
('u5', 'Eve', 'eve@example.com', false, NULL, NOW(), NOW());

-- =============================
-- ACCOUNTS
-- =============================
INSERT INTO account (id, account_id, password, provider_id, user_id, created_at, updated_at) VALUES
(UUID(), 'acct-u1', 'a2304398871383c77711f49417c1fb69:d06b5de1c55ec5ade4d1220959e89d6c9944eb92d5314dd4060c10f167378e80c190fb2eea966345a2e70bdfc08e5a4cb9bb9689850e48c3f4baaf4a52157932', 'credential', 'u1', NOW(), NOW()),
(UUID(), 'acct-u2', 'a2304398871383c77711f49417c1fb69:d06b5de1c55ec5ade4d1220959e89d6c9944eb92d5314dd4060c10f167378e80c190fb2eea966345a2e70bdfc08e5a4cb9bb9689850e48c3f4baaf4a52157932', 'credential', 'u2', NOW(), NOW()),
(UUID(), 'acct-u3', 'a2304398871383c77711f49417c1fb69:d06b5de1c55ec5ade4d1220959e89d6c9944eb92d5314dd4060c10f167378e80c190fb2eea966345a2e70bdfc08e5a4cb9bb9689850e48c3f4baaf4a52157932', 'credential', 'u3', NOW(), NOW()),
(UUID(), 'acct-u4', 'a2304398871383c77711f49417c1fb69:d06b5de1c55ec5ade4d1220959e89d6c9944eb92d5314dd4060c10f167378e80c190fb2eea966345a2e70bdfc08e5a4cb9bb9689850e48c3f4baaf4a52157932', 'credential', 'u4', NOW(), NOW()),
(UUID(), 'acct-u5', 'a2304398871383c77711f49417c1fb69:d06b5de1c55ec5ade4d1220959e89d6c9944eb92d5314dd4060c10f167378e80c190fb2eea966345a2e70bdfc08e5a4cb9bb9689850e48c3f4baaf4a52157932', 'credential', 'u5', NOW(), NOW());

-- =============================
-- SESSIONS
-- =============================
INSERT INTO session (id, token, expires_at, created_at, updated_at, ip_address, user_agent, user_id) VALUES
(UUID(), 'token-u1', NOW() + INTERVAL 1 HOUR, NOW(), NOW(), '127.0.0.1', 'SeedBot', 'u1'),
(UUID(), 'token-u2', NOW() + INTERVAL 1 HOUR, NOW(), NOW(), '127.0.0.1', 'SeedBot', 'u2'),
(UUID(), 'token-u3', NOW() + INTERVAL 1 HOUR, NOW(), NOW(), '127.0.0.1', 'SeedBot', 'u3'),
(UUID(), 'token-u4', NOW() + INTERVAL 1 HOUR, NOW(), NOW(), '127.0.0.1', 'SeedBot', 'u4'),
(UUID(), 'token-u5', NOW() + INTERVAL 1 HOUR, NOW(), NOW(), '127.0.0.1', 'SeedBot', 'u5');

-- =============================
-- VERIFICATION
-- =============================
INSERT INTO verification (id, identifier, value, expires_at, created_at, updated_at) VALUES
(UUID(), 'verify-u1', '123456', NOW() + INTERVAL 10 MINUTE, NOW(), NOW()),
(UUID(), 'verify-u2', '123456', NOW() + INTERVAL 10 MINUTE, NOW(), NOW()),
(UUID(), 'verify-u3', '123456', NOW() + INTERVAL 10 MINUTE, NOW(), NOW()),
(UUID(), 'verify-u4', '123456', NOW() + INTERVAL 10 MINUTE, NOW(), NOW()),
(UUID(), 'verify-u5', '123456', NOW() + INTERVAL 10 MINUTE, NOW(), NOW());

-- =============================
-- POSTS
-- =============================
INSERT INTO posts (id, title, content) VALUES
(UUID(), 'Post 1', 'This is content for post 1'),
(UUID(), 'Post 2', 'This is content for post 2'),
(UUID(), 'Post 3', 'This is content for post 3'),
(UUID(), 'Post 4', 'This is content for post 4'),
(UUID(), 'Post 5', 'This is content for post 5');

-- =============================
-- ROLES
-- =============================
INSERT INTO roles (id, name) VALUES
('r_admin', 'admin'),
('r_editor', 'editor'),
('r_viewer', 'viewer'),
('r_contributor', 'contributor'),
('r_guest', 'guest'),
('r_superadmin', 'superadmin');

-- =============================
-- RESOURCES
-- =============================
INSERT INTO resources (id, name, description) VALUES
('res_users', 'users', 'User management'),
('res_posts', 'posts', 'Post management');

-- =============================
-- PERMISSIONS
-- =============================
INSERT INTO permissions (id, resource_id, action) VALUES
('p1', 'res_users', 'CREATE'),
('p2', 'res_users', 'READ'),
('p3', 'res_users', 'DELETE'),
('p4', 'res_users', 'UPDATE'),
('p5', 'res_posts', 'CREATE'),
('p6', 'res_posts', 'READ'),
('p7', 'res_posts', 'DELETE'),
('p8', 'res_posts', 'UPDATE');

-- =============================
-- ROLE PERMISSIONS
-- =============================

-- ✅ ADMIN → ALL
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'r_admin', id FROM permissions;

-- ✅ SUPERADMIN → ALL (same as admin but explicit)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'r_superadmin', id FROM permissions;

-- ✅ EDITOR → ONLY POSTS
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'r_editor', id FROM permissions WHERE resource_id = 'res_posts';

-- =============================
-- USER ROLES
-- =============================
INSERT INTO user_roles (user_id, role_id) VALUES
('u1', 'r_admin'),
('u2', 'r_editor'),
('u3', 'r_viewer'),
('u4', 'r_contributor'),
('u5', 'r_guest');

-- (optional) make Alice SUPERADMIN 🔥
INSERT INTO user_roles (user_id, role_id) VALUES
('u1', 'r_superadmin');

-- =============================
-- POLICIES (ABAC)
-- =============================
INSERT INTO policies (id, resource, action, effect, conditions) VALUES
(UUID(), 'posts', 'READ', 'allow', NULL),
(UUID(), 'posts', 'CREATE', 'allow', NULL),
(UUID(), 'users', 'READ', 'allow', NULL),
(UUID(), 'users', 'DELETE', 'deny', NULL),
(UUID(), 'posts', 'DELETE', 'deny', NULL);