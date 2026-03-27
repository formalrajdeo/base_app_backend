// src/modules/roles/role.schema.ts
import { z } from "zod";

export const createRoleSchema = z.object({
    name: z.string().min(3, "Role name too short"),
});