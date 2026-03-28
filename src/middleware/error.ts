// src/middleware/error.ts

import { logger } from "@/lib/logger";
import { Request, Response, NextFunction } from "express";
import { isHttpError } from "http-errors";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isDev = process.env.NODE_ENV !== "production";

  // Log full error
  logger.error(err);

  // ✅ Handle known HTTP errors (createHttpError)
  if (isHttpError(err)) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(isDev && { stack: err.stack }),
    });
  }

  // ❌ Unknown errors (fallback)
  return res.status(500).json({
    success: false,
    message: isDev ? err.message : "Internal Server Error",
    ...(isDev && { stack: err.stack }),
  });
};