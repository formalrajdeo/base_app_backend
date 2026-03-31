import { db } from "@/config/db.js";
import {
    roles,
    permissions,
    userRoles,
    rolePermissions,
    resources,
} from "@/db/schema/rbac.js";
import { eq, inArray } from "drizzle-orm";

export async function checkPermission(
    userId: string,
    resource: string,
    action: string
): Promise<boolean> {
    // 1. Get user roles
    const userRolesResult = await db
        .select({
            roleId: roles.id,
            roleName: roles.name,
        })
        .from(userRoles)
        .innerJoin(roles, eq(roles.id, userRoles.roleId))
        .where(eq(userRoles.userId, userId));

    if (!userRolesResult.length) return false;

    // 2. SUPERADMIN BYPASS
    const isSuperAdmin = userRolesResult.some(
        (r) => r.roleName === "superadmin"
    );

    if (isSuperAdmin) return true;

    // 3. Continue normal RBAC
    const roleIds = userRolesResult.map((r) => r.roleId);

    const perms = await db
        .select({
            resource: resources.name,
            action: permissions.action,
        })
        .from(rolePermissions)
        .innerJoin(
            permissions,
            eq(permissions.id, rolePermissions.permissionId)
        )
        .innerJoin(
            resources,
            eq(resources.id, permissions.resourceId)
        )
        .where(inArray(rolePermissions.roleId, roleIds));

    return perms.some(
        (p) => p.resource === resource && p.action === action
    );
}