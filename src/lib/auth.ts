// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/config/db.js";
import { account, session, user, verification, twoFactor } from "@/db/schema/auth";
import { roles, userRoles } from "@/db/schema/rbac.js";
import { inArray, eq } from "drizzle-orm";
import { createAuthMiddleware } from "better-auth/api";
import { twoFactor as twoFactorPlugin } from "better-auth/plugins";
import { admin as adminPlugin } from "better-auth/plugins/admin";
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, userAc, adminAc } from "better-auth/plugins/admin/access";
import { invalidateUserPermissions, getUserPermissions } from "@/services/authorization.service.js";
import { logger } from "./logger";

// Environment helper
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export const ENV = {
  FRONTEND_BASE_URL: requireEnv("FRONTEND_BASE_URL"),
  BACKEND_BASE_URL: requireEnv("BACKEND_BASE_URL"),
};

// ---------------- ROLES & ACCESS CONTROL ----------------
export const betterAuthPluginAccessControl = createAccessControl(defaultStatements);

export const betterAuthPluginUser = betterAuthPluginAccessControl.newRole({
  ...userAc.statements,
  user: [...userAc.statements.user, "list"],
});

export const betterAuthPluginAdmin = betterAuthPluginAccessControl.newRole(adminAc.statements);

// ---------------- AUTH CONFIG ----------------
export const auth = betterAuth({
  appName: "Base App",
  baseUrl: ENV.BACKEND_BASE_URL,
  allowedOrigins: [ENV.BACKEND_BASE_URL],
  trustedOrigins: [ENV.BACKEND_BASE_URL, ENV.FRONTEND_BASE_URL],
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: { user, session, account, verification, twoFactor },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => { /* send email */ },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => { /* send email */ },
  },
  session: { cookieCache: { enabled: true, maxAge: 60 } },
  user: {
    changeEmail: { enabled: true },
    deleteUser: { enabled: true },
    additionalFields: { role: { type: "string", required: true, defaultValue: "user", input: false } },
  },
  socialProviders: {
    github: { clientId: process.env.GITHUB_CLIENT_ID!, clientSecret: process.env.GITHUB_CLIENT_SECRET! },
  },
  advanced: { disableCSRFCheck: process.env.NODE_ENV !== "production" },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // ---------------- SIGNUP ----------------
      if (ctx.path.startsWith("/sign-up")) {
        const newUser = ctx.context.newSession?.user ?? { name: ctx.body.name, email: ctx.body.email };
        if (!newUser) return;

        // 1️⃣ Get DB user
        const [userRecord] = await db.select().from(user).where(eq(user.email, newUser.email)).limit(1);
        if (!userRecord) return logger.error("User not found after signup");

        // 2️⃣ Assign default role
        const [defaultRole] = await db.select().from(roles).where(eq(roles.name, "user")).limit(1);
        if (defaultRole) await db.insert(userRoles).values({ userId: userRecord.id, roleId: defaultRole.id });

        // 3️⃣ Invalidate + prepopulate permissions cache
        await invalidateUserPermissions(userRecord.id);
        await getUserPermissions(userRecord.id);
      }

      // ---------------- ROLE OR PERMISSION UPDATES ----------------
      if (ctx.path.startsWith("/update-user-role") && ctx.context.userId) {
        await invalidateUserPermissions(ctx.context.userId);
      }

      if (ctx.path.startsWith("/update-role-permissions") && ctx.body.roleIds) {
        const affectedUsers = await db
          .select({ userId: userRoles.userId })
          .from(userRoles)
          .where(inArray(userRoles.roleId, ctx.body.roleIds));

        for (const u of affectedUsers) await invalidateUserPermissions(u.userId);
      }
    }),
  },
  acceptNullOrigin: process.env.NODE_ENV === "development",
  plugins: [
    twoFactorPlugin(),
    adminPlugin({
      betterAuthPluginAccessControl,
      roles: {
        user: betterAuthPluginUser,
        admin: betterAuthPluginAdmin,
        superadmin: betterAuthPluginAdmin,
      },
    }),
  ],
});