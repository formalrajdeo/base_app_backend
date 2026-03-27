import { db } from "@/config/db.js";
import { permissions } from "@/db/schema/rbac.js";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export const PermissionService = {
  async createPermission(resource: string, action: string) {
    const permission = {
      id: uuid(),
      resource,
      action,
    };
    await db.insert(permissions).values(permission);
    return permission;
  },

  async getAllPermissions() {
    return await db.select().from(permissions);
  },

  async getPermissionById(id: string) {
    return await db.select().from(permissions).where(eq(permissions.id, id));
  },

  async deletePermission(id: string) {
    await db.delete(permissions).where(eq(permissions.id, id));
    return { id };
  },
};