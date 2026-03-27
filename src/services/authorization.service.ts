import { db } from "@/config/db.js";
import { roles, permissions, userRoles, rolePermissions } from "@/db/schema/rbac.js";
import { eq, inArray } from "drizzle-orm";

export async function checkPermission(
    userId: string,
    resource: string,
    action: string,
    context?: any
): Promise<boolean> {
    const getUserRoles = await db
        .select({ roleId: roles.id })
        .from(userRoles)
        .innerJoin(roles, eq(roles.id, userRoles.roleId))
        .where(eq(userRoles.userId, userId));

    if (!getUserRoles.length) return false;

    const roleIds = getUserRoles.map(r => r.roleId);

    const perms = await db
        .select()
        .from(rolePermissions)
        .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
        .where(inArray(rolePermissions.roleId, roleIds));

    const allowed = perms.some(
        p => p.permissions.resource === resource && p.permissions.action === action
    );

    return allowed;
}