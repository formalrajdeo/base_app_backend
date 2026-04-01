import { Router } from "express";
import { validateBody } from "@/lib/validate.js";
import { createUserSchema, updateUserSchema } from "./user.schema.js";
import { UserController } from "./user.controller.js";
import { authenticate } from "@/middleware/auth.js";
import { Module } from "@/constants/permissions.js";
import { authFor } from "@/lib/rbac";

const router = Router();
const auth = authFor(Module.USERS);

router.post("/", authenticate, auth.CREATE, validateBody(createUserSchema), UserController.create);
router.get("/", authenticate, auth.READ, UserController.getAll);
router.get("/:id", authenticate, auth.READ, UserController.getById);
router.patch("/:id", authenticate, auth.UPDATE, validateBody(updateUserSchema), UserController.update);
router.delete("/:id", authenticate, auth.DELETE, UserController.delete);

// Examnple : To add dynamic auth like RAJNIKANTH, etc.
// router.post("/:id/rajnikanth", authenticate, auth.RAJNIKANTH, UserController.create);

// ROLES
router.post("/:id/roles", authenticate, auth.UPDATE, UserController.assignRoles);
router.post("/:id/roles/:roleId", authenticate, auth.UPDATE, UserController.addRole);
router.delete("/:id/roles/:roleId", authenticate, auth.UPDATE, UserController.removeRole);

export default router;