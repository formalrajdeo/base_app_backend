// src/modules/posts/posts.routes.ts
import { Router } from "express";
import { validateBody } from "@/lib/validate.js";
import { createPostSchema, updatePostSchema } from "./post.schema.js";
import { PostController } from "./post.controller.js";
import { authenticate } from "@/middleware/auth.js";
import { authorize } from "@/middleware/authorize.js";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize("posts", "CREATE"),
    validateBody(createPostSchema),
    PostController.create
);

router.get("/",
    // authenticate,
    // authorize("posts", "READ"),
    PostController.getAll);
router.get("/:id", authenticate, authorize("posts", "READ"), PostController.getById);
router.patch(
    "/:id",
    authenticate,
    authorize("posts", "UPDATE"),
    validateBody(updatePostSchema),
    PostController.update
);
router.delete("/:id", authenticate, authorize("posts", "DELETE"), PostController.delete);

export default router;