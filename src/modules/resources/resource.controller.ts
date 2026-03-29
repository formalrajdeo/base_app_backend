// src/modules/resources/resource.controller.ts
import { Request, Response, NextFunction } from "express";
import { ResourceService } from "./resource.service";

export const ResourceController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description } = req.body;

            const resource = await ResourceService.createResource(
                name,
                description
            );

            res.status(201).json(resource);
        } catch (err) {
            next(err);
        }
    },

    async getWithPermissions(req: Request, res: Response, next: NextFunction) {
        try {
            // const data = await ResourceService.getResourcesWithPermissions();
            const data = await ResourceService.getGroupedResourcesWithPermissions();

            res.json(data);
        } catch (err) {
            next(err);
        }
    },

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ResourceService.getAllResources();
            res.json(data);
        } catch (err) {
            next(err);
        }
    },
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as { id: string };
            const data = await ResourceService.deleteResource(id);
            res.json(data);
        } catch (err) {
            next(err);
        }
    },
    async createAction(req: Request, res: Response, next: NextFunction) {
        try {
            const { resourceId } = req.params as { resourceId: string };
            const { action } = req.body;

            const result = await ResourceService.createAction(resourceId, action);

            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    },

    async deleteAction(req: Request, res: Response, next: NextFunction) {
        try {
            const { permissionId } = req.params as { permissionId: string };

            await ResourceService.deleteAction(permissionId);

            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    }
};