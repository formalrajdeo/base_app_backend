// src/services/authorization.service.ts
import { db } from "@/config/db.js";
import { roles, userRoles, rolePermissions, permissions, resources } from "@/db/schema/rbac.js";
import { eq, inArray } from "drizzle-orm";
import { redis } from "@/config/redis.js";

export async function invalidateUserPermissions(userId: string) {
    const cacheKey = `perm:${userId}`;
    await redis.del(cacheKey);
}

export async function getUserPermissions(userId: string) {
    const cacheKey = `perm:${userId}`;

    // Check Redis first
    const cached = await redis.smembers(cacheKey);
    if (cached.length) return new Set(cached);

    // Fetch roles from DB
    const userRolesResult = await db
        .select({ roleId: roles.id, roleName: roles.name })
        .from(userRoles)
        .innerJoin(roles, eq(roles.id, userRoles.roleId))
        .where(eq(userRoles.userId, userId));

    if (!userRolesResult.length) return new Set();

    // Superadmin bypass
    if (userRolesResult.some(r => r.roleName === "superadmin")) {
        const perms = new Set(["*:*"]);
        await redis.sadd(cacheKey, "*:*");
        await redis.expire(cacheKey, 60 * 10); // 60 seconds * 60 minutes = 3600 seconds = 1 hour
        return perms;
    }

    // Fetch role permissions
    const roleIds = userRolesResult.map(r => r.roleId);
    const permsFromDB = await db
        .select({ resource: resources.name, action: permissions.action })
        .from(rolePermissions)
        .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
        .innerJoin(resources, eq(resources.id, permissions.resourceId))
        .where(inArray(rolePermissions.roleId, roleIds));

    const perms = new Set(permsFromDB.map(p => `${p.resource}:${p.action}`));

    // Cache in Redis
    if (perms.size) {
        const pipeline = redis.pipeline();
        for (const p of perms) pipeline.sadd(cacheKey, p);
        pipeline.expire(cacheKey, 60 * 10); // 10 min TTL
        await pipeline.exec();
    }

    return perms;
}

export async function checkPermission(userId: string, module: string, action: string): Promise<boolean> {
    const perms = await getUserPermissions(userId);
    return perms.has("*:*") || perms.has(`${module}:${action}`);
}