import { db } from "@/config/db.js";
import {
    roles,
    permissions,
    userRoles,
    rolePermissions,
} from "@/db/schema/rbac.js";
import { eq, inArray } from "drizzle-orm";
import { logger } from "@/lib/logger";

export async function checkPermission(
    userId: string,
    resource: string,
    action: string,
    context?: any
): Promise<boolean> {
    try {
        // 1. Get user roles
        const userRolesResult = await db
            .select({ roleId: roles.id })
            .from(userRoles)
            .innerJoin(roles, eq(roles.id, userRoles.roleId))
            .where(eq(userRoles.userId, userId));

        if (!userRolesResult.length) {
            logger.warn(`No roles found for user ${userId}`);
            return false;
        }

        const roleIds = userRolesResult.map((r) => r.roleId);

        // 2. Get permissions
        const perms = await db
            .select({
                resource: permissions.resource,
                action: permissions.action,
            })
            .from(rolePermissions)
            .innerJoin(
                permissions,
                eq(permissions.id, rolePermissions.permissionId)
            )
            .where(inArray(rolePermissions.roleId, roleIds));

        // 3. Check permission
        const allowed = perms.some(
            (p) => p.resource === resource && p.action === action
        );

        return allowed;
    } catch (error) {
        logger.error("Permission check failed", {
            userId,
            resource,
            action,
            error,
        });

        // IMPORTANT: throw error so global handler catches it
        throw error;
    }
}