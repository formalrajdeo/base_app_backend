// src/modules/posts/post.schema.ts
import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(1),
  authorId: z.string().uuid(),
});

export const updatePostSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(1).optional(),
});