// src/middleware/error.ts
import { logger } from "@/lib/logger";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err);

  res.status(500).json({
    message: "Internal Server Error",
  });
};