import { z } from "zod";

export const createPermissionSchema = z.object({
  name: z.string().min(3, "Permission name too short"),
});