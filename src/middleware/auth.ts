// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next(new createHttpError.Unauthorized());

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = payload; // must include user.id, user.roles, etc.
    next();
  } catch {
    next(new createHttpError.Unauthorized("Invalid token"));
  }
};