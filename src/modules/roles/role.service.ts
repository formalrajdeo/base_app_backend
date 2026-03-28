// src/modules/roles/role.service.ts
import { db } from "@/config/db.js";
import { roles } from "@/db/schema/rbac.js";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

import { rolePermissions, permissions } from "@/db/schema/rbac.js";

export const RoleService = {
  async createRole(name: string) {
    const role = { id: uuid(), name };
    await db.insert(roles).values(role);
    return role;
  },

  async getAllRoles() {
    return await db.select().from(roles);
  },

  async getRoleById(id: string) {
    return await db.select().from(roles).where(eq(roles.id, id));
  },

  async deleteRole(id: string) {
    await db.delete(roles).where(eq(roles.id, id));
    return { id };
  },

  async getRoleWithPermissions(roleId: string) {
    const role = await db
      .select()
      .from(roles)
      .where(eq(roles.id, roleId));

    if (!role.length) return null;

    const perms = await db
      .select({
        id: permissions.id,
        resource: permissions.resource,
        action: permissions.action,
      })
      .from(rolePermissions)
      .innerJoin(
        permissions,
        eq(rolePermissions.permissionId, permissions.id)
      )
      .where(eq(rolePermissions.roleId, roleId));

    return {
      ...role[0],
      permissions: perms,
    };
  }
};