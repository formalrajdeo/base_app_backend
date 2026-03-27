// src/modules/posts/post.service.ts
import { db } from "@/config/db.js";
import { posts } from "@/db/schema/posts.js";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export const PostService = {
  async createPost(title: string, content: string, authorId: string) {
    const post = { id: uuid(), title, content, authorId };
    await db.insert(posts).values(post);
    return post;
  },

  async getAllPosts() {
    return await db.select().from(posts);
  },

  async getPostById(id: string) {
    const result = await db.select().from(posts).where(eq(posts.id, id));
    return result[0] || null;
  },

  async updatePost(id: string, data: { title?: string; content?: string }) {
    await db.update(posts).set(data).where(eq(posts.id, id));
    return await PostService.getPostById(id);
  },

  async deletePost(id: string) {
    await db.delete(posts).where(eq(posts.id, id));
    return { id };
  },
};