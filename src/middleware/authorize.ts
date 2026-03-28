// src/middleware/authorize.ts
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { checkPermission } from "@/services/authorization.service.js";
import { logger } from "better-auth";

/**
 * Dynamic authorization middleware
 * @param resource e.g. "users", "posts"
 * @param action e.g. "CREATE", "READ"
 */
export const authorize = (resource: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // set by authentication middleware
    if (!user) return next(new createHttpError.Unauthorized("Not logged in"));

    // dynamic permission check, ABAC optional via request body
    const allowed = await checkPermission(user.id, resource, action, req.body);
    logger.info(`Authorization check for user ${user.id} on ${resource}:${action} - ${allowed ? "ALLOWED" : "DENIED"}`);
    if (!allowed) return next(new createHttpError.Forbidden("Access denied"));

    next();
  };
};