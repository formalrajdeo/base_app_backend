// src/modules/roles/role.controller.ts
import { Request, Response, NextFunction } from "express";
import { RoleService } from "./role.service.js";
import createHttpError from "http-errors";
import { invalidateUserPermissions } from "@/services/authorization.service.js";

export const RoleController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body;
            const role = await RoleService.createRole(name);
            res.status(201).json(role);
        } catch (err) {
            next(err);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const data = req.body;
            const updatedUser = await RoleService.update(id, data);
            if (!updatedUser) throw new createHttpError.NotFound("User not found");
            res.json(updatedUser);
        } catch (err) {
            next(err);
        }
    },
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const roles = await RoleService.getAllRoles();
            res.json(roles);
        } catch (err) {
            next(err);
        }
    },

    // async getById(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const id = req.params.id as string;
    //         const role = await RoleService.getRoleById(id);
    //         if (!role.length) throw new createHttpError.NotFound("Role not found");
    //         res.json(role[0]);
    //     } catch (err) {
    //         next(err);
    //     }
    // },
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;

            const role = await RoleService.getRoleWithPermissions(id);

            if (!role) throw new createHttpError.NotFound("Role not found");

            res.json(role);
        } catch (err) {
            next(err);
        }
    },
    async assignPermission(req: Request, res: Response, next: NextFunction) {
        try {
            const { roleId, permissionId } = req.params as { roleId: string; permissionId: string };
            await RoleService.assignPermission(roleId, permissionId);

            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    },

    async removePermission(req: Request, res: Response, next: NextFunction) {
        try {
            const { roleId, permissionId } = req.params as { roleId: string; permissionId: string };
            await invalidateUserPermissions(req.user.id); // TODO: not worked check again
            await RoleService.removePermission(roleId, permissionId);

            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    },
    async assignResource(req: Request, res: Response, next: NextFunction) {
        try {
            const { roleId, resourceId } = req.params as { roleId: string; resourceId: string };

            await RoleService.assignResourceById(roleId, resourceId);

            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    },
    async removeResource(req: Request, res: Response, next: NextFunction) {
        try {
            const { roleId, resourceId } = req.params as { roleId: string; resourceId: string };

            await RoleService.removeResource(roleId, resourceId);

            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    },
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            await RoleService.deleteRole(id);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },
};