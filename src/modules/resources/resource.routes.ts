import { Router } from "express";
import { ResourceController } from "./resource.controller";
import { validateBody } from "@/lib/validate";
import { createResourceSchema } from "./resource.schema";
import { authenticate } from "@/middleware/auth";
import { Module } from "@/constants/permissions.js";
import { authFor } from "@/lib/rbac";

const router = Router();
const auth = authFor(Module.RESOURCES);

// RESOURCE CRUD
router.post("/", authenticate, auth.CREATE, validateBody(createResourceSchema), ResourceController.create);
router.get("/", authenticate, auth.READ, ResourceController.getAll);
router.get("/with-permissions", authenticate, auth.READ, ResourceController.getWithPermissions);
router.delete("/:id", authenticate, auth.DELETE, ResourceController.delete);

// RESOURCE ACTIONS
router.post("/:resourceId/actions", authenticate, auth.UPDATE, ResourceController.createAction);
router.delete("/:resourceId/actions/:permissionId", authenticate, auth.UPDATE, ResourceController.deleteAction);

export default router;