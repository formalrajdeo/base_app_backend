import { Router } from "express";
import { validateBody } from "@/lib/validate.js";
import { createPermissionSchema, updatePermissionSchema } from "./permission.schema.js";
import { PermissionController } from "./permission.controller.js";
import { authenticate } from "@/middleware/auth.js";
import { authorize } from "@/middleware/authorize.js";

const router = Router();

// CREATE (Superadmin only)
router.post(
  "/",
  authenticate,
  authorize("permissions", "CREATE"),
  validateBody(createPermissionSchema),
  PermissionController.create
);

// READ ALL
router.get(
  "/",
  authenticate,
  authorize("permissions", "READ"),
  PermissionController.getAll
);

// READ BY ID
router.get(
  "/:id",
  authenticate,
  authorize("permissions", "READ"),
  PermissionController.getById
);

// UPDATE
router.patch(
  "/:id",
  authenticate,
  authorize("permissions", "UPDATE"),
  validateBody(updatePermissionSchema),
  PermissionController.update
);

// DELETE
router.delete(
  "/:id",
  authenticate,
  authorize("permissions", "DELETE"),
  PermissionController.delete
);

export default router;