// db/schema/rbac.ts
import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const roles = mysqlTable("roles", {
    id: varchar("id", { length: 191 }).primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
});

export const permissions = mysqlTable("permissions", {
    id: varchar("id", { length: 191 }).primaryKey(),
    resource: varchar("resource", { length: 100 }).notNull(),
    action: varchar("action", { length: 50 }).notNull(),
});

export const rolePermissions = mysqlTable("role_permissions", {
    roleId: varchar("role_id", { length: 191 }).notNull(),
    permissionId: varchar("permission_id", { length: 191 }).notNull(),
});

export const userRoles = mysqlTable("user_roles", {
    userId: varchar("user_id", { length: 191 }).notNull(), // from better-auth users.id
    roleId: varchar("role_id", { length: 191 }).notNull(),
});