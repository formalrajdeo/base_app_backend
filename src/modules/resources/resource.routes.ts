// src/modules/resources/resource.routes.ts

import { Router } from "express";
import { ResourceController } from "./resource.controller";
import { validateBody } from "@/lib/validate";
import { createResourceSchema } from "./resource.schema";
import { authenticate } from "@/middleware/auth";
import { authorize } from "@/middleware/authorize";

const router = Router();

/**
 * =========================
 * RESOURCE ROUTES
 * =========================
 */

// ✅ Create resource
router.post(
    "/",
    authenticate,
    authorize("resources", "CREATE"),
    validateBody(createResourceSchema),
    ResourceController.create
);

// ✅ Get all resources
router.get(
    "/",
    authenticate,
    authorize("resources", "READ"),
    ResourceController.getAll
);

// ✅ Get resources with permissions (grouped)
router.get(
    "/with-permissions",
    authenticate,
    authorize("resources", "READ"),
    ResourceController.getWithPermissions
);

router.delete(
    "/:id",
    authenticate,
    authorize("resources", "DELETE"),
    ResourceController.delete
);

/**
 * =========================
 * ACTION (PERMISSION) ROUTES 🔥
 * =========================
 */

// ✅ Create new action for a resource
router.post(
    "/:resourceId/actions",
    authenticate,
    authorize("resources", "UPDATE"),
    ResourceController.createAction
);

// ✅ Delete action from resource
router.delete(
    "/:resourceId/actions/:permissionId",
    authenticate,
    authorize("resources", "UPDATE"),
    ResourceController.deleteAction
);

export default router;