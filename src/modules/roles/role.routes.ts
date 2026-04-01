import { Router } from "express";
import { validateBody } from "@/lib/validate.js";
import { createRoleSchema } from "./role.schema.js";
import { RoleController } from "./role.controller.js";
import { authenticate } from "@/middleware/auth.js";
import { Module } from "@/constants/permissions.js";
import { authFor } from "@/lib/rbac";

const router = Router();
const auth = authFor(Module.ROLES);

router.post("/", authenticate, auth.CREATE, validateBody(createRoleSchema), RoleController.create);
router.get("/", authenticate, auth.READ, RoleController.getAll);
router.get("/:id", authenticate, auth.READ, RoleController.getById);
router.patch("/:id", authenticate, auth.UPDATE, validateBody(createRoleSchema), RoleController.update);
router.delete("/:id", authenticate, auth.DELETE, RoleController.delete);

// PERMISSIONS
router.post("/:roleId/permissions/:permissionId", authenticate, auth.UPDATE, RoleController.assignPermission);
router.delete("/:roleId/permissions/:permissionId", authenticate, auth.UPDATE, RoleController.removePermission);

// RESOURCES
router.post("/:roleId/resources/:resourceId", authenticate, auth.UPDATE, RoleController.assignResource);
router.delete("/:roleId/resources/:resourceId", authenticate, auth.UPDATE, RoleController.removeResource);

export default router;