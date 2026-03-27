// src/modules/users/users.routes.ts
import { Router } from "express";
import { validateBody } from "@/lib/validate.js";
import { createUserSchema, updateUserSchema } from "./user.schema.js";
import { UserController } from "./user.controller.js";
import { authenticate } from "@/middleware/auth.js";
import { authorize } from "@/middleware/authorize.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("users", "CREATE"),
  validateBody(createUserSchema),
  UserController.create
);

router.get("/", authenticate, authorize("users", "READ"), UserController.getAll);
router.get("/:id", authenticate, authorize("users", "READ"), UserController.getById);
router.patch(
  "/:id",
  authenticate,
  authorize("users", "UPDATE"),
  validateBody(updateUserSchema),
  UserController.update
);
router.delete("/:id", authenticate, authorize("users", "DELETE"), UserController.delete);

export default router;