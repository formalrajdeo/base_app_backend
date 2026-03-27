// src/modules/posts/post.controller.ts
import { Request, Response, NextFunction } from "express";
import { PostService } from "./post.service.js";
import createHttpError from "http-errors";

export const PostController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content, authorId } = req.body;
      const post = await PostService.createPost(title, content, authorId);
      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await PostService.getAllPosts();
      res.json(posts);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const post = await PostService.getPostById(id);
      if (!post) throw new createHttpError.NotFound("Post not found");
      res.json(post);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const post = await PostService.updatePost(id, req.body);
      if (!post) throw new createHttpError.NotFound("Post not found");
      res.json(post);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await PostService.deletePost(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};