import {
    mysqlTable,
    varchar,
    text,
    timestamp,
} from "drizzle-orm/mysql-core";

/**
 * ROLES
 */
export const roles = mysqlTable("roles", {
    id: varchar("id", { length: 191 }).primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

/**
 * RESOURCES
 */
export const resources = mysqlTable("resources", {
    id: varchar("id", { length: 191 }).primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

/**
 * PERMISSIONS
 * (resourceId + action)
 */
export const permissions = mysqlTable("permissions", {
    id: varchar("id", { length: 191 }).primaryKey(),

    // FK → resources
    resourceId: varchar("resource_id", { length: 191 })
        .notNull()
        .references(() => resources.id, {
            onDelete: "cascade",
        }),

    action: varchar("action", { length: 50 }).notNull(),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

/**
 * ROLE → PERMISSIONS (M:N)
 */
export const rolePermissions = mysqlTable("role_permissions", {
    roleId: varchar("role_id", { length: 191 })
        .notNull()
        .references(() => roles.id, {
            onDelete: "cascade",
        }),

    permissionId: varchar("permission_id", { length: 191 })
        .notNull()
        .references(() => permissions.id, {
            onDelete: "cascade",
        }),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

/**
 * USER → ROLES (M:N)
 */
export const userRoles = mysqlTable("user_roles", {
    userId: varchar("user_id", { length: 191 }).notNull(), // from better-auth

    roleId: varchar("role_id", { length: 191 })
        .notNull()
        .references(() => roles.id, {
            onDelete: "cascade",
        }),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});