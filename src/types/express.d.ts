// src/types/express.d.ts

import { auth } from "@/lib/auth";

// Infer session type from better-auth
type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

declare module "express-serve-static-core" {
    interface Request {
        // Logged-in user
        user?: Session["user"];

        // Full session object
        session?: Session;
    }
}

export { };