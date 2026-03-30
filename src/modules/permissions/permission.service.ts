import { db } from "@/config/db.js";
import { resources, permissions } from "@/db/schema/rbac.js";
import { eq, and } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import createHttpError from "http-errors";

export const PermissionService = {
  async createOrAssignPermission(resourceName: string, action: string, description: string) {
    if (!resourceName || !action || !description) throw createHttpError.BadRequest("Resource, action, and description required");

    // Check if resource exists
    const existingResource = await db.select().from(resources).where(eq(resources.name, resourceName));

    if (existingResource.length) {
      // Resource exists → assign action
      const resourceId = existingResource[0].id;

      const existingPermission = await db
        .select()
        .from(permissions)
        .where(and(eq(permissions.resourceId, resourceId), eq(permissions.action, action)));

      if (existingPermission.length) {
        throw createHttpError.Conflict(`Permission '${action}' already exists for resource '${resourceName}'`);
      }

      const permission = { id: uuid(), resourceId, action, description };
      await db.insert(permissions).values(permission);
      return { resource: existingResource[0], permission };
    } else {
      // Resource does not exist → create resource + permission
      const resource = { id: uuid(), name: resourceName, description: description };
      await db.insert(resources).values(resource);

      const permission = { id: uuid(), resourceId: resource.id, action, description };
      await db.insert(permissions).values(permission);
      return { resource, permission };
    }
  },
  // Create resource + initial permission
  async createResourceWithPermission(resourceName: string, action: string, description: string) {
    if (!resourceName || !action || !description) throw createHttpError.BadRequest("Resource, action, and description required");

    const existingResource = await db.select().from(resources).where(eq(resources.name, resourceName));
    if (existingResource.length) throw createHttpError.Conflict(`Resource '${resourceName}' already exists`);

    const resource = { id: uuid(), name: resourceName, description: description };
    await db.insert(resources).values(resource);

    const permission = { id: uuid(), resourceId: resource.id, action, description };
    await db.insert(permissions).values(permission);

    return { resource, permission };
  },

  // Assign action to existing resource
  async assignPermission(resourceId: string, action: string, description: string) {
    if (!resourceId) throw createHttpError.BadRequest("Resource ID is required");
    if (!action) throw createHttpError.BadRequest("Action is required");
    if (!description) throw createHttpError.BadRequest("Description is required");

    const resource = await db.select().from(resources).where(eq(resources.id, resourceId));
    if (!resource.length) throw createHttpError.BadRequest("Resource not found");

    const existing = await db
      .select()
      .from(permissions)
      .where(and(eq(permissions.resourceId, resourceId), eq(permissions.action, action)));

    if (existing.length)
      throw createHttpError.Conflict(`Permission '${action}' already exists for resource '${resource[0].name}'`);

    const permission = { id: uuid(), resourceId, action };
    await db.insert(permissions).values(permission);

    return { id: permission.id, resource: resource[0].name, action };
  },

  async getPermissionById(id: string) {
    const result = await db
      .select({
        id: permissions.id,
        action: permissions.action,
        resource: resources.name,
      })
      .from(permissions)
      .innerJoin(resources, eq(permissions.resourceId, resources.id))
      .where(eq(permissions.id, id));

    return result.length ? result[0] : null;
  },

  async updatePermission(id: string, resourceName: string, action: string) {
    if (!resourceName || !action) throw createHttpError.BadRequest("Resource and action required");

    const resource = await db.select().from(resources).where(eq(resources.name, resourceName));
    if (!resource.length) throw createHttpError.BadRequest(`Resource '${resourceName}' not found`);

    const existing = await db
      .select()
      .from(permissions)
      .where(and(eq(permissions.resourceId, resource[0].id), eq(permissions.action, action)));

    if (existing.length) throw createHttpError.Conflict(`Permission '${action}' already exists for resource '${resourceName}'`);

    await db
      .update(permissions)
      .set({ action, resourceId: resource[0].id })
      .where(eq(permissions.id, id));

    return { id, resource: resourceName, action };
  },

  async deletePermission(id: string) {
    await db.delete(permissions).where(eq(permissions.id, id));
    return { id };
  },

  async getAllPermissions() {
    return await db
      .select({
        id: permissions.id,
        action: permissions.action,
        resource: resources.name,
      })
      .from(permissions)
      .innerJoin(resources, eq(permissions.resourceId, resources.id));
  },
};