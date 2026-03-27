// src/modules/users/user.controller.ts
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { UserService } from "./user.service";

export const UserController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const user = await UserService.create(name, email, password);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAll();
      res.json(users);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = await UserService.getById(id);
      if (!user) throw new createHttpError.NotFound("User not found");
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = req.body;
      const updatedUser = await UserService.update(id, data);
      if (!updatedUser) throw new createHttpError.NotFound("User not found");
      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await UserService.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};