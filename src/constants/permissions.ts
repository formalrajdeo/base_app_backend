// src/constants/permissions.ts

// --------------------
// Base actions (common CRUD)
// --------------------
export enum BaseAction {
    CREATE = "create",
    READ = "read",
    UPDATE = "update",
    DELETE = "delete",
}

// --------------------
// Module-specific extra actions
// --------------------
export enum UsersAction {
    BAN = "ban",
    RAJNIKANTH = "rajnikanth",
}

export enum PostsAction {
    PUBLISH = "publish",
}

export enum SystemAction {
    MAINTAINER = "maintainer",
}

// --------------------
// Modules
// --------------------
export enum Module {
    DEFAULT = "default",
    USERS = "users",
    ROLES = "roles",
    POSTS = "posts",
    PERMISSIONS = "permissions",
    RESOURCES = "resources",
    SYSTEM = "system",
}

// --------------------
// Full module → allowed actions mapping
// --------------------
export const MODULE_ACTIONS = {
    default: BaseAction,
    users: { ...BaseAction, ...UsersAction },
    roles: BaseAction,
    posts: { ...BaseAction, ...PostsAction },
    permissions: BaseAction,
    resources: BaseAction,
    system: { ...BaseAction, ...SystemAction },
} as const;

// --------------------
// Optional: Type helpers for authorize middleware
// --------------------
export type ModuleActionMap = {
    default: BaseAction;
    users: BaseAction | UsersAction;
    roles: BaseAction;
    posts: BaseAction | PostsAction;
    permissions: BaseAction;
    resources: BaseAction;
    system: BaseAction | SystemAction;
};