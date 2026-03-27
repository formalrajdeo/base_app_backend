import { db } from "@/config/db";
import { userRoles, roles, rolePermissions, permissions } from "@/db/schema/rbac";
import { eq } from "drizzle-orm";

export class RBACService {
    async getPermissions(userId: string) {
        const rows = await db
            .select({
                resource: permissions.resource,
                action: permissions.action,
            })
            .from(userRoles)
            .innerJoin(roles, eq(userRoles.roleId, roles.id))
            .innerJoin(rolePermissions, eq(rolePermissions.roleId, roles.id))
            .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
            .where(eq(userRoles.userId, userId));

        // rows is now typed: Array<{ resource: string, action: string }>
        return rows.map(p => `${p.resource}:${p.action}`);
    }

    async hasPermission(userId: string, resource: string, action: string) {
        const perms = await this.getPermissions(userId);
        return perms.includes(`${resource}:${action}`);
    }
}