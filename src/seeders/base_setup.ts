import "dotenv/config";
import { v4 as uuid } from "uuid";
import {
  roles,
  permissions,
  rolePermissions,
  userRoles,
  resources,
} from "../db/schema/rbac";
import { posts } from "../db/schema/posts";
import { policies } from "../db/schema/abac";
import { user, account, session, verification } from "../db/schema/auth"; // assuming these exist
import { db, pool } from "@/db";

async function seed() {
  console.log("🌱 Seeding...");

  // ----- USERS -----
  const userIds = Array.from({ length: 5 }, () => uuid());
  await db.insert(user).values([
    {
      id: userIds[0],
      name: "Alice",
      email: "alice@example.com",
      emailVerified: true,  // <-- camelCase
      image: null,
      createdAt: new Date(), // <-- camelCase
      updatedAt: new Date(), // <-- camelCase
    },
    {
      id: userIds[1],
      name: "Bob",
      email: "bob@example.com",
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: userIds[2],
      name: "Charlie",
      email: "charlie@example.com",
      emailVerified: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: userIds[3],
      name: "Diana",
      email: "diana@example.com",
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: userIds[4],
      name: "Eve",
      email: "eve@example.com",
      emailVerified: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // ----- ACCOUNTS -----
  await db.insert(account).values(
    userIds.map(id => ({
      id: uuid(),
      accountId: `acct-${id.slice(0, 8)}`, // camelCase
      providerId: "github",                // camelCase
      userId: id,
      accessToken: null,
      refreshToken: null,
      idToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );

  // ----- SESSIONS -----
  await db.insert(session).values(
    userIds.map(id => ({
      id: uuid(),
      token: `token-${id.slice(0, 8)}`,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // camelCase
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: "127.0.0.1",
      userAgent: "SeedBot",
      userId: id,
    }))
  );

  // ----- VERIFICATIONS -----
  await db.insert(verification).values(
    userIds.map(id => ({
      id: uuid(),
      identifier: `verify-${id.slice(0, 8)}`,
      value: "123456",
      expiresAt: new Date(Date.now() + 1000 * 60 * 10), // camelCase
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );

  // ----- POSTS -----
  await db.insert(posts).values(
    Array.from({ length: 5 }).map((_, i) => ({
      id: uuid(),
      title: `Post ${i + 1}`,
      content: `This is content for post ${i + 1}`,
    }))
  );

  // ----- ROLES -----
  const adminRoleId = uuid();
  const editorRoleId = uuid();
  const viewerRoleId = uuid();
  const contributorRoleId = uuid();
  const guestRoleId = uuid();

  await db.insert(roles).values([
    { id: adminRoleId, name: "admin" },
    { id: editorRoleId, name: "editor" },
    { id: viewerRoleId, name: "viewer" },
    { id: contributorRoleId, name: "contributor" },
    { id: guestRoleId, name: "guest" },
  ]);

  // ----- RESOURCES -----
  const usersResourceId = uuid();
  const postsResourceId = uuid();

  await db.insert(resources).values([
    {
      id: usersResourceId,
      name: "users",
      description: "User management",
    },
    {
      id: postsResourceId,
      name: "posts",
      description: "Post management",
    },
  ]);

  // ----- PERMISSIONS -----
  const permList = [
    { resourceId: usersResourceId, action: "READ" },
    { resourceId: usersResourceId, action: "CREATE" },
    { resourceId: usersResourceId, action: "DELETE" },

    { resourceId: postsResourceId, action: "CREATE" },
    { resourceId: postsResourceId, action: "READ" },
    { resourceId: postsResourceId, action: "DELETE" },
    { resourceId: postsResourceId, action: "UPDATE" },
  ].map(p => ({
    id: uuid(),
    ...p,
  }));

  await db.insert(permissions).values(permList);

  // ----- ROLE PERMISSIONS -----

  // ✅ Admin gets ALL permissions
  await db.insert(rolePermissions).values(
    permList.map(p => ({
      roleId: adminRoleId,
      permissionId: p.id,
    }))
  );

  // ✅ Editor gets ONLY posts permissions
  await db.insert(rolePermissions).values(
    permList
      .filter(p => p.resourceId === postsResourceId) // 🔥 FIXED
      .map(p => ({
        roleId: editorRoleId,
        permissionId: p.id,
      }))
  );

  // ----- USER ROLES -----
  await db.insert(userRoles).values([
    { userId: userIds[0], roleId: adminRoleId },
    { userId: userIds[1], roleId: editorRoleId },
    { userId: userIds[2], roleId: viewerRoleId },
    { userId: userIds[3], roleId: contributorRoleId },
    { userId: userIds[4], roleId: guestRoleId },
  ]);

  // ----- POLICIES -----
  await db.insert(policies).values([
    { id: uuid(), resource: "posts", action: "READ", effect: "allow", conditions: null },
    { id: uuid(), resource: "posts", action: "CREATE", effect: "allow", conditions: null },
    { id: uuid(), resource: "users", action: "READ", effect: "allow", conditions: null },
    { id: uuid(), resource: "users", action: "DELETE", effect: "deny", conditions: null },
    { id: uuid(), resource: "posts", action: "DELETE", effect: "deny", conditions: null },
  ]);

  // superadmin role
  const superAdminRoleId = uuid();

  await db.insert(roles).values({
    id: superAdminRoleId,
    name: "superadmin",
  });

  // give ALL permissions
  await db.insert(rolePermissions).values(
    permList.map(p => ({
      roleId: superAdminRoleId,
      permissionId: p.id,
    }))
  );

  console.log("✅ Seeding done!");
  // Gracefully close the MySQL pool
  await pool.end();
  process.exit(0); // optional, ensures exit
}

seed().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});