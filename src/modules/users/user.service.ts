import { db } from "@/config/db.js";
import { user } from "@/db/schema/auth.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const UserService = {
  async create(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: uuid(), name, email, password: hashedPassword };
    await db.insert(user).values(newUser);
    return { ...newUser, password: undefined };
  },

  async getAll() {
    const users = await db.select().from(user);
    return users.map(u => ({ ...u, password: undefined }));
  },

  async getById(id: string) {
    const result = await db.select().from(user).where(eq(user.id, id));
    return result[0] ? { ...result[0], password: undefined } : null;
  },

  async update(id: string, data: { name?: string; email?: string; password?: string }) {
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    await db.update(user).set(data).where(eq(user.id, id));
    return await UserService.getById(id);
  },

  async delete(id: string) {
    await db.delete(user).where(eq(user.id, id));
    return { id };
  },
};