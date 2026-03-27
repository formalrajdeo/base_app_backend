// db/schema/abac.ts
import { mysqlTable, varchar, json } from "drizzle-orm/mysql-core";

export const policies = mysqlTable("policies", {
  id: varchar("id", { length: 191 }).primaryKey(),
  resource: varchar("resource", { length: 100 }).notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  effect: varchar("effect", { length: 10 }).notNull(), // allow | deny
  conditions: json("conditions"),
});