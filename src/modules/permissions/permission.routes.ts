// src/modules/permissions/permissions.routes.ts
import { Router } from "express";
import { validateBody } from "@/lib/validate.js";
import { createPermissionSchema } from "./permission.schema.js";
import { PermissionController } from "./permission.controller.js";
import { authenticate } from "@/middleware/auth.js";
import { authorize } from "@/middleware/authorize.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("permissions", "CREATE"),
  validateBody(createPermissionSchema),
  PermissionController.create
);

router.get("/",
  // authenticate,
  // authorize("permissions", "READ"),
  PermissionController.getAll);
router.get("/:id", authenticate, authorize("permissions", "READ"), PermissionController.getById);
// router.patch(
//   "/:id",
//   authenticate,
//   authorize("permissions", "UPDATE"),
//   validateBody(createPermissionSchema),
//   PermissionController.update
// );
router.delete("/:id", authenticate, authorize("permissions", "DELETE"), PermissionController.delete);

export default router;