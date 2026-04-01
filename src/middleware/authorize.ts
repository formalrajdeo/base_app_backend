// src/middleware/authorize.ts
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { checkPermission } from "@/services/authorization.service";
import { Module, BaseAction, UsersAction, PostsAction, SystemAction } from "@/constants/permissions";

type ActionType = BaseAction | UsersAction | PostsAction | SystemAction;

export const authorize = (module: Module, action: ActionType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) return next(new createHttpError.Unauthorized("Not logged in"));

      const allowed = await checkPermission(user.id, module.toLowerCase(), action.toLowerCase());

      if (process.env.NODE_ENV === "development") {
        console.log(
          `Auth check → User: ${user.id}, Module: ${module}, Action: ${action}, Allowed: ${allowed}`
        );
      }

      if (!allowed) return next(new createHttpError.Forbidden("Access denied"));

      next();
    } catch (err) {
      next(err);
    }
  };
};