// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { auth } from "@/lib/auth";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Convert Express headers -> Fetch Headers
    const headers = new Headers();

    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v));
        } else {
          headers.set(key, value);
        }
      }
    });

    const session = await auth.api.getSession({
      headers,
    });

    if (!session || !session.user) {
      return next(new createHttpError.Unauthorized("Not authenticated"));
    }

    req.user = session.user;
    req.session = session;

    next();
  } catch (error) {
    next(new createHttpError.Unauthorized("Authentication failed"));
  }
};