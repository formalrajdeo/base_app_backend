import { Router } from "express";
import { validateBody } from "@/lib/validate.js";
import { createPermissionSchema, updatePermissionSchema } from "./permission.schema.js";
import { PermissionController } from "./permission.controller.js";
import { authenticate } from "@/middleware/auth.js";
import { Module } from "@/constants/permissions.js";
import { authFor } from "@/lib/rbac";

const router = Router();
const auth = authFor(Module.PERMISSIONS);

router.post("/", authenticate, auth.CREATE, validateBody(createPermissionSchema), PermissionController.create);
router.get("/", authenticate, auth.READ, PermissionController.getAll);
router.get("/:id", authenticate, auth.READ, PermissionController.getById);
router.patch("/:id", authenticate, auth.UPDATE, validateBody(updatePermissionSchema), PermissionController.update);
router.delete("/:id", authenticate, auth.DELETE, PermissionController.delete);

export default router;