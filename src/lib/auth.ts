import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { account, session, user, verification, twoFactor } from "@/db/schema/auth";
import { sendEmailConfirmationEmail } from "./emails/email-confirmation";
import { sendDeleteAccountVerificationEmail } from "./emails/delete-account-verification";
import { twoFactor as twoFactorPlugin } from "better-auth/plugins";
import { admin as adminPlugin } from "better-auth/plugins/admin"

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const ENV = {
  FRONTEND_BASE_URL: requireEnv("FRONTEND_BASE_URL"),
  BACKEND_BASE_URL: requireEnv("BACKEND_BASE_URL"),
}

// ---------- ROLES & ACCESS CONTROL BY BETTERAUTH'S ADMIN PLUGIN ----------
// Define your roles and permissions here. This is a simple example with "user" and "admin" roles.
import { createAccessControl } from "better-auth/plugins/access"
import { defaultStatements, userAc, adminAc } from "better-auth/plugins/admin/access"
import { sendPasswordResetEmail } from "./emails/password-reset-email";
import { sendEmailVerificationEmail } from "./emails/email-verification";
import { createAuthMiddleware } from "better-auth/api";
import { sendWelcomeEmail } from "./emails/welcome-email";
import { roles, userRoles } from "@/db/schema/rbac";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

export const betterAuthPluginAccessControl = createAccessControl(defaultStatements)

export const betterAuthPluginUser = betterAuthPluginAccessControl.newRole({
  ...userAc.statements,
  user: [...userAc.statements.user, "list"],
})

export const betterAuthPluginAdmin = betterAuthPluginAccessControl.newRole(adminAc.statements)

// ----------

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
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ user, url })
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerificationEmail({ user, url })
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60, // 1 minute
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url, newEmail }: { user: any; url: string; newEmail: string }) => {
        await sendEmailConfirmationEmail({
          // user: { ...user, email: newEmail },
          user: { ...user },
          url,
          newEmail,
        })
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendDeleteAccountVerificationEmail({ user, url })
      },
    },
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
        input: false
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  advanced: {
    // 2. ADD THIS: Recommended for local development/testing only
    // This allows requests without an Origin header to succeed
    disableCSRFCheck: process.env.NODE_ENV !== "production",
  },
  hooks: {
    after: createAuthMiddleware(async ctx => {
      if (!ctx.path.startsWith("/sign-up")) return

      const newUser = ctx.context.newSession?.user ?? {
        name: ctx.body.name,
        email: ctx.body.email,
      }

      if (!newUser) return

      // 1 Send welcome email
      try {
        await sendWelcomeEmail(newUser)
      } catch (err) {
        logger.error("Failed to send welcome email:", err)
      }

      // 2 Get the newly created user record from DB
      const [userRecord] = await db.select().from(user)
        .where(eq(user.email, newUser.email))
        .limit(1)

      if (!userRecord) {
        logger.error("User record not found after signup:", newUser.email)
        return
      }

      // 3 Get default 'user' role from roles table
      const [defaultRole] = await db.select().from(roles)
        .where(eq(roles.name, "user"))
        .limit(1)

      if (!defaultRole) {
        logger.error("Default role 'user' not found in roles table")
        return
      }

      // 4 Insert into user_roles
      try {
        await db.insert(userRoles).values({
          userId: userRecord.id,
          roleId: defaultRole.id,
        })
      } catch (err) {
        logger.error("Failed to assign default role to user:", err)
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
      },
    }),
    // organization({
    //   sendInvitationEmail: async ({ email, organization, inviter, invitation }: any) => {
    //     await sendOrganizationInviteEmail({
    //       invitation,
    //       inviter: inviter.user,
    //       organization,
    //       email,
    //     })
    //   },
    // }),
  ],
});