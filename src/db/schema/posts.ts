// src/db/schema/posts.ts
import { mysqlTable, varchar, text, serial, primaryKey } from "drizzle-orm/mysql-core";

export const posts = mysqlTable("posts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
});