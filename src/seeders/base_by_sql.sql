delete from user;
delete from account;
delete from session;
delete from verification;
delete from posts;
delete from resources;
delete from permissions;
delete from roles;
delete from role_permissions;
delete from user_roles;
delete from policies;
delete from two_factor;
-- =========================
-- USERS
-- =========================
INSERT INTO user (id, name, email, email_verified, role, banned)
VALUES
('u0', 'Super Admin', 'superadmin@gmail.com', true, 'admin', false);

-- =========================
-- ACCOUNTS
-- =========================
INSERT INTO account (id, account_id, password, provider_id, user_id, created_at, updated_at)
VALUES
('a0', 'acc0', 'a2304398871383c77711f49417c1fb69:d06b5de1c55ec5ade4d1220959e89d6c9944eb92d5314dd4060c10f167378e80c190fb2eea966345a2e70bdfc08e5a4cb9bb9689850e48c3f4baaf4a52157932', 'credential', 'u0', NOW(), NOW());
-- =========================
-- POSTS
-- =========================
INSERT INTO posts (id, title, content)
VALUES
('p0', 'Post 0', 'Content 0');

-- =========================
-- RESOURCES
-- =========================
INSERT INTO resources (id, name, description)
VALUES
('r1', 'posts', 'Posts resource'),
('r2', 'users', 'Users resource'),
('r3', 'roles', 'Roles resource');


-- =========================
-- ROLES
-- =========================
INSERT INTO roles (id, name)
VALUES
('role0', 'superadmin'),
('role1', 'admin'),
('role2', 'user');

-- =========================
-- USER ROLES
-- =========================
INSERT INTO user_roles (user_id, role_id)
VALUES
('u0', 'role0'),
('u0', 'role1');