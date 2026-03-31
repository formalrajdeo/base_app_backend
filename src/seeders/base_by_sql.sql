-- =========================
-- USERS
-- =========================
INSERT INTO user (id, name, email, email_verified, role, banned)
VALUES
('u1', 'Super Admin', 'superadmin@example.com', true, 'user', false),
('u2', 'John Doe', 'john@example.com', true, 'user', false),
('u3', 'Jane Smith', 'jane@example.com', true, 'user', false),
('u4', 'Mike Ross', 'mike@example.com', false, 'user', false),
('u5', 'Rachel Zane', 'rachel@example.com', true, 'user', false);

-- =========================
-- ACCOUNTS
-- =========================
INSERT INTO account (id, account_id, password, provider_id, user_id, created_at, updated_at)
VALUES
('a1', 'acc1', 'a2304398871383c77711f49417c1fb69:d06b5de1c55ec5ade4d1220959e89d6c9944eb92d5314dd4060c10f167378e80c190fb2eea966345a2e70bdfc08e5a4cb9bb9689850e48c3f4baaf4a52157932', 'credential', 'u1', NOW(), NOW()),
('a2', 'acc2', 'a2304398871383c77711f49417c1fb69:d06b5de1c55ec5ade4d1220959e89d6c9944eb92d5314dd4060c10f167378e80c190fb2eea966345a2e70bdfc08e5a4cb9bb9689850e48c3f4baaf4a52157932', 'credential', 'u2', NOW(), NOW()),
('a3', 'acc3', 'a2304398871383c77711f49417c1fb69:d06b5de1c55ec5ade4d1220959e89d6c9944eb92d5314dd4060c10f167378e80c190fb2eea966345a2e70bdfc08e5a4cb9bb9689850e48c3f4baaf4a52157932', 'credential', 'u3', NOW(), NOW()),
('a4', 'acc4', 'a2304398871383c77711f49417c1fb69:d06b5de1c55ec5ade4d1220959e89d6c9944eb92d5314dd4060c10f167378e80c190fb2eea966345a2e70bdfc08e5a4cb9bb9689850e48c3f4baaf4a52157932', 'credential', 'u4', NOW(), NOW()),
('a5', 'acc5', 'a2304398871383c77711f49417c1fb69:d06b5de1c55ec5ade4d1220959e89d6c9944eb92d5314dd4060c10f167378e80c190fb2eea966345a2e70bdfc08e5a4cb9bb9689850e48c3f4baaf4a52157932', 'credential', 'u5', NOW(), NOW());

-- =========================
-- SESSIONS
-- =========================
INSERT INTO session (id, expires_at, token, created_at, updated_at, user_id)
VALUES
('s1', NOW() + INTERVAL 1 DAY, 'token1', NOW(), NOW(), 'u1'),
('s2', NOW() + INTERVAL 1 DAY, 'token2', NOW(), NOW(), 'u2'),
('s3', NOW() + INTERVAL 1 DAY, 'token3', NOW(), NOW(), 'u3'),
('s4', NOW() + INTERVAL 1 DAY, 'token4', NOW(), NOW(), 'u4'),
('s5', NOW() + INTERVAL 1 DAY, 'token5', NOW(), NOW(), 'u5');

-- =========================
-- VERIFICATION
-- =========================
INSERT INTO verification (id, identifier, value, expires_at)
VALUES
('v1', 'email', 'code1', NOW() + INTERVAL 1 DAY),
('v2', 'email', 'code2', NOW() + INTERVAL 1 DAY),
('v3', 'email', 'code3', NOW() + INTERVAL 1 DAY),
('v4', 'email', 'code4', NOW() + INTERVAL 1 DAY),
('v5', 'email', 'code5', NOW() + INTERVAL 1 DAY);

-- =========================
-- POSTS
-- =========================
INSERT INTO posts (id, title, content)
VALUES
('p1', 'Post 1', 'Content 1'),
('p2', 'Post 2', 'Content 2'),
('p3', 'Post 3', 'Content 3'),
('p4', 'Post 4', 'Content 4'),
('p5', 'Post 5', 'Content 5');

-- =========================
-- RESOURCES
-- =========================
INSERT INTO resources (id, name, description)
VALUES
('r1', 'posts', 'Posts resource'),
('r2', 'users', 'Users resource'),
('r3', 'roles', 'Roles resource'),
('r4', 'permissions', 'Permissions resource'),
('r5', 'dashboard', 'Dashboard resource');

-- =========================
-- PERMISSIONS
-- =========================
INSERT INTO permissions (id, resource_id, action)
VALUES
('perm1', 'r1', 'create'),
('perm2', 'r1', 'read'),
('perm3', 'r2', 'read'),
('perm4', 'r3', 'manage'),
('perm5', 'r5', 'access');

-- =========================
-- ROLES
-- =========================
INSERT INTO roles (id, name)
VALUES
('role1', 'superadmin'),
('role2', 'user'),
('role3', 'editor'),
('role4', 'viewer'),
('role5', 'manager');

-- =========================
-- ROLE PERMISSIONS
-- =========================
INSERT INTO role_permissions (role_id, permission_id)
VALUES
('role1', 'perm1'),
('role1', 'perm2'),
('role2', 'perm2'),
('role3', 'perm1'),
('role4', 'perm2');

-- =========================
-- USER ROLES
-- =========================
INSERT INTO user_roles (user_id, role_id)
VALUES
('u1', 'role1'),
('u1', 'role2'),
('u2', 'role2'),
('u3', 'role2'),
('u4', 'role2'),
('u5', 'role2');

-- =========================
-- POLICIES
-- =========================
INSERT INTO policies (id, resource, action, effect, conditions)
VALUES
('pol1', 'posts', 'create', 'allow', NULL),
('pol2', 'posts', 'read', 'allow', NULL),
('pol3', 'users', 'read', 'allow', NULL),
('pol4', 'roles', 'manage', 'allow', NULL),
('pol5', 'dashboard', 'access', 'allow', NULL);

-- =========================
-- TWO FACTOR
-- =========================
INSERT INTO two_factor (id, secret, backup_codes, user_id)
VALUES
('tf1', 'secret1', 'code1,code2', 'u1'),
('tf2', 'secret2', 'code1,code2', 'u2'),
('tf3', 'secret3', 'code1,code2', 'u3'),
('tf4', 'secret4', 'code1,code2', 'u4'),
('tf5', 'secret5', 'code1,code2', 'u5');