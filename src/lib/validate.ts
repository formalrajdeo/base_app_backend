// src/lib/validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

/**
 * Middleware to validate request body with Zod schema
 */
export const validateBody =
  (schema: ZodObject<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse(req.body);
        next();
      } catch (err) {
        if (err instanceof ZodError) {
          return res.status(400).json({
            message: "Validation Error",
            errors: err.issues.map(issue => ({
              path: issue.path.join("."),
              message: issue.message,
            })),
          });
        }
        next(err);
      }
    };

/**
 * Middleware to validate query params with Zod schema
 */
export const validateQuery =
  (schema: ZodObject<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse(req.query);
        next();
      } catch (err) {
        if (err instanceof ZodError) {
          return res.status(400).json({
            message: "Query Validation Error",
            errors: err.issues.map(issue => ({
              path: issue.path.join("."),
              message: issue.message,
            })),
          });
        }
        next(err);
      }
    };