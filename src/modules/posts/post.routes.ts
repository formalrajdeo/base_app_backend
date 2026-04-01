import { Router } from "express";
import { validateBody } from "@/lib/validate.js";
import { createPostSchema, updatePostSchema } from "./post.schema.js";
import { PostController } from "./post.controller.js";
import { authenticate } from "@/middleware/auth.js";
import { Module } from "@/constants/permissions.js";
import { authFor } from "@/lib/rbac";

const router = Router();
const auth = authFor(Module.POSTS);

router.post("/", authenticate, auth.CREATE, validateBody(createPostSchema), PostController.create);
router.get("/", authenticate, auth.READ, PostController.getAll);
router.get("/:id", authenticate, auth.READ, PostController.getById);
router.patch("/:id", authenticate, auth.UPDATE, validateBody(updatePostSchema), PostController.update);
router.delete("/:id", authenticate, auth.DELETE, PostController.delete);

export default router;