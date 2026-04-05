// src/modules/roles/role.service.ts
import { db } from "@/config/db.js";
import { resources, roles } from "@/db/schema/rbac.js";
import { and, eq, notInArray } from "drizzle-orm";
import { v4 as uuid } from "uuid";

import { rolePermissions, permissions } from "@/db/schema/rbac.js";
import { invalidateUsersByRole } from "@/services/authorization.service";

export const RoleService = {
  async createRole(name: string) {
    const role = { id: uuid(), name };
    await db.insert(roles).values(role);
    return role;
  },

  async update(
    id: string,
    data: { name?: string }
  ) {

    await db.update(roles).set(data).where(eq(roles.id, id));

    return await RoleService.getRoleById(id);
  },
  async getAllRoles() {
    return await db
      .select()
      .from(roles)
      .where(notInArray(roles.name, ['superadmin'])); // Exclude superadmin
  },

  async getRoleById(id: string) {
    return await db.select().from(roles).where(eq(roles.id, id));
  },

  async deleteRole(id: string) {
    await db.delete(roles).where(eq(roles.id, id));
    return { id };
  },

  async getRoleWithPermissions(roleId: string) {
    // Get the role
    const role = await db.select().from(roles).where(eq(roles.id, roleId));
    if (!role.length) return null;

    // Get all resources with permissions
    const rows = await db
      .select({
        resourceId: resources.id,
        resourceName: resources.name,
        permissionId: permissions.id,
        action: permissions.action,
      })
      .from(resources)
      .leftJoin(permissions, eq(resources.id, permissions.resourceId));

    // Get assigned permissions for this role
    const assigned = await db
      .select({ permissionId: rolePermissions.permissionId })
      .from(rolePermissions)
      .where(eq(rolePermissions.roleId, roleId));

    const assignedIds = new Set(assigned.map((a) => a.permissionId));

    const map: Record<string, any> = {};
    for (const row of rows) {
      if (!map[row.resourceId]) {
        map[row.resourceId] = {
          id: row.resourceId,
          name: row.resourceName,
          permissions: [],
        };
      }
      if (row.permissionId) {
        map[row.resourceId].permissions.push({
          id: row.permissionId,
          action: row.action,
          assigned: assignedIds.has(row.permissionId), // mark assigned
        });
      }
    }

    return {
      ...role[0],
      permissions: Object.values(map).flatMap((r) => r.permissions),
    };
  },
  async assignPermission(roleId: string, permissionId: string, userId: string) {
    await db.insert(rolePermissions).values({
      roleId,
      permissionId,
    });
    await invalidateUsersByRole(roleId);
  },
  async assignResourceById(roleId: string, resourceId: string) {
    const perms = await db
      .select({ id: permissions.id })
      .from(permissions)
      .where(eq(permissions.resourceId, resourceId));

    for (const p of perms) {
      await db.insert(rolePermissions).values({
        roleId,
        permissionId: p.id,
      });
    }

    await invalidateUsersByRole(roleId);
  },
  async removeResource(roleId: string, resourceId: string) {
    const perms = await db
      .select({ id: permissions.id })
      .from(permissions)
      .where(eq(permissions.resourceId, resourceId));

    for (const p of perms) {
      await db
        .delete(rolePermissions)
        .where(
          and(
            eq(rolePermissions.roleId, roleId),
            eq(rolePermissions.permissionId, p.id)
          )
        );
    }
    await invalidateUsersByRole(roleId);
  },
  async removePermission(roleId: string, permissionId: string, userId: string) {
    await db
      .delete(rolePermissions)
      .where(
        and(
          eq(rolePermissions.roleId, roleId),
          eq(rolePermissions.permissionId, permissionId)
        )
      );
    await invalidateUsersByRole(roleId);
  },
};