import { Request, Response, NextFunction } from "express";
import { PermissionService } from "./permission.service.js";
import { CreatePermissionInput, UpdatePermissionInput } from "./permission.schema.js";
import createHttpError from "http-errors";

export const PermissionController = {
  // CREATE new resource + permission OR assign action
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { resource, resourceId, action, description } = req.body as CreatePermissionInput;

      if (!action) throw createHttpError.BadRequest("Action is required");

      let permission;

      if (!action) throw new Error("Action is required");

      if (resource) {
        // Assign action to existing resource OR create resource
        permission = await PermissionService.createOrAssignPermission(resource, action, description ?? null);
      } else if (resourceId) {
        permission = await PermissionService.assignPermission(resourceId, action);
      } else {
        throw createHttpError.BadRequest("Either 'resource' or 'resourceId' must be provided");
      }

      res.status(201).json({ success: true, data: permission });
    } catch (err) {
      next(err);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const permissions = await PermissionService.getAllPermissions();
      res.json({ success: true, data: permissions });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const permission = await PermissionService.getPermissionById(id);
      if (!permission) throw createHttpError.NotFound("Permission not found");
      res.json({ success: true, data: permission });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { resource, action } = req.body as UpdatePermissionInput;

      if (!resource || !action) {
        return res.status(400).json({ success: false, message: "Resource and action are required" });
      }

      const permission = await PermissionService.updatePermission(id, resource, action);
      res.json({ success: true, data: permission });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await PermissionService.deletePermission(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};