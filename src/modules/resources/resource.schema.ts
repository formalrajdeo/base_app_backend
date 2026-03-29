// src/modules/resources/resource.schema.ts
import { z } from "zod";

// ✅ Create resource
export const createResourceSchema = z.object({
    name: z
        .string()
        .min(2, "Resource name too short")
        .max(100)
        .regex(/^[a-zA-Z0-9_-]+$/, "Invalid resource name"), // 🔥 clean names

    description: z
        .string()
        .max(255)
        .optional(),
});

// ✅ Update resource (optional for future)
export const updateResourceSchema = z.object({
    name: z
        .string()
        .min(2)
        .max(100)
        .regex(/^[a-zA-Z0-9_-]+$/)
        .optional(),

    description: z
        .string()
        .max(255)
        .optional(),
});