// src/modules/roles/roles.routes.ts
import { Router } from "express";
import { validateBody } from "@/lib/validate.js";
import { createRoleSchema } from "./role.schema.js";
import { RoleController } from "./role.controller.js";
import { authenticate } from "@/middleware/auth.js";
import { authorize } from "@/middleware/authorize.js";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize("roles", "CREATE"),
    validateBody(createRoleSchema),
    RoleController.create
);
router.get("/",
    authenticate,
    authorize("roles", "READ"),
    RoleController.getAll);
router.get("/:id",
    authenticate,
    authorize("roles", "READ"),
    RoleController.getById);
// ASSIGN PERMISSION TO ROLE
router.post(
    "/:roleId/permissions/:permissionId",
    authenticate,
    authorize("roles", "UPDATE"),
    RoleController.assignPermission
);
// REMOVE PERMISSION FROM ROLE
router.delete(
    "/:roleId/permissions/:permissionId",
    authenticate,
    authorize("roles", "UPDATE"),
    RoleController.removePermission
);
// DELETE ROLE
router.delete(
    "/:id",
    authenticate,
    authorize("roles", "DELETE"),
    RoleController.delete
);
router.patch(
    "/:id",
    authenticate,
    authorize("roles", "UPDATE"),
    validateBody(createRoleSchema),
    RoleController.update
);
router.post(
    "/:roleId/resources/:resourceId",
    authenticate,
    authorize("roles", "UPDATE"),
    RoleController.assignResource
);
router.delete(
    "/:roleId/resources/:resourceId",
    authenticate,
    authorize("roles", "UPDATE"),
    RoleController.removeResource
);
router.delete("/:id", authenticate, authorize("roles", "DELETE"), RoleController.delete);

export default router;