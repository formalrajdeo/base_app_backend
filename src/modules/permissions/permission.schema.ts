import { z } from "zod";

export const createPermissionSchema = z
  .object({
    resource: z.string().optional(), // new resource name
    resourceId: z.string().optional(), // existing resource
    action: z.string().min(1, "Action required"),
  })
  .refine((data) => data.resource || data.resourceId, {
    message: "Either resource or resourceId is required",
    path: ["resource", "resourceId"],
  });

export const updatePermissionSchema = z.object({
  id: z.string(),
  resource: z.string().min(1, "Resource required"),
  action: z.string().min(1, "Action required"),
});

export type CreatePermissionInput = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>;