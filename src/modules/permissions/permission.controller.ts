import { Request, Response, NextFunction } from "express";
import { PermissionService } from "./permission.service.js";
import createHttpError from "http-errors";

export const PermissionController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { resource, action } = req.body;
      const permission = await PermissionService.createPermission(resource, action);
      res.status(201).json(permission);
    } catch (err) {
      next(err);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const permissions = await PermissionService.getAllPermissions();
      res.json(permissions);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const permission = await PermissionService.getPermissionById(id);
      if (!permission.length) throw new createHttpError.NotFound("Permission not found");
      res.json(permission[0]);
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