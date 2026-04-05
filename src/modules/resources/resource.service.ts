import { db } from "@/db";
import { resources, permissions, rolePermissions } from "@/db/schema/rbac";
import { v4 as uuid } from "uuid";
import { and, eq } from "drizzle-orm";

export const ResourceService = {
    async createResource(name: string, description?: string) {
        // prevent duplicate resource
        const existing = await db
            .select()
            .from(resources)
            .where(eq(resources.name, name));

        if (existing.length) {
            throw new Error("Resource already exists");
        }

        const resourceId = uuid();

        await db.insert(resources).values({
            id: resourceId,
            name,
            description,
        });

        const DEFAULT_ACTIONS = ["read", "create", "update", "delete"] as const;
        const perms = DEFAULT_ACTIONS.map(action => ({
            id: uuid(),
            resourceId,
            action,
        }));

        await db.insert(permissions).values(perms);

        return {
            id: resourceId,
            name,
            description,
            permissions: perms,
        };
    },

    async getResourcesWithPermissions() {
        return await db
            .select({
                resourceId: resources.id,
                resourceName: resources.name,
                permissionId: permissions.id,
                action: permissions.action,
            })
            .from(resources)
            .leftJoin(permissions, eq(resources.id, permissions.resourceId));
    },

    async getGroupedResourcesWithPermissions() {
        const rows = await db
            .select({
                resourceId: resources.id,
                resourceName: resources.name,
                permissionId: permissions.id,
                action: permissions.action,
            })
            .from(resources)
            .leftJoin(permissions, eq(resources.id, permissions.resourceId));

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
                });
            }
        }

        return Object.values(map);
    },
    async deleteResource(id: string) {
        // Check if resource exists
        const existing = await db
            .select()
            .from(resources)
            .where(eq(resources.id, id));
        if (!existing.length) {
            throw new Error("Resource not found");
        }
        await db.delete(resources).where(eq(resources.id, id));
        return { id };
    },
    async createAction(resourceId: string, action: string) {
        const exists = await db
            .select()
            .from(permissions)
            .where(
                and(
                    eq(permissions.resourceId, resourceId),
                    eq(permissions.action, action)
                )
            );

        if (exists.length) {
            throw new Error("Action already exists");
        }

        const perm = {
            id: uuid(),
            resourceId,
            action,
        };

        await db.insert(permissions).values(perm);

        return perm;
    },
    async deleteAction(permissionId: string) {
        const used = await db
            .select()
            .from(rolePermissions)
            .where(eq(rolePermissions.permissionId, permissionId));

        if (used.length) {
            throw new Error("Permission is assigned to roles");
        }

        await db
            .delete(permissions)
            .where(eq(permissions.id, permissionId));
    },
    async getAllResources() {
        return await db.select().from(resources);
    },
};