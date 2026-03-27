import "dotenv/config";
import { permissions, rolePermissions, roles, userRoles } from "@/db/schema/rbac";
import { account, session, user, verification } from "@/db/schema/auth";
import { posts } from "@/db/schema/posts";
import { policies } from "@/db/schema/abac";
import { db, pool } from "@/db";

async function destroy() {
  console.log("🧹 Destroying all data...");

  // Order matters due to FK constraints
  await db.delete(userRoles).execute();
  await db.delete(rolePermissions).execute();
  await db.delete(roles).execute();
  await db.delete(permissions).execute();
  await db.delete(verification).execute();
  await db.delete(session).execute();
  await db.delete(account).execute();
  await db.delete(posts).execute();
  await db.delete(policies).execute();
  await db.delete(user).execute();

  console.log("✅ All tables cleared!");
  // Gracefully close the MySQL pool
  await pool.end();
  process.exit(0); // optional, ensures exit
}

destroy().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});