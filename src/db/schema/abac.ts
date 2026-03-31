// db/schema/abac.ts
import { mysqlTable, varchar, json, timestamp } from "drizzle-orm/mysql-core";

export const policies = mysqlTable("policies", {
  id: varchar("id", { length: 191 }).primaryKey(),
  resource: varchar("resource", { length: 100 }).notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  effect: varchar("effect", { length: 10 }).notNull(), // allow | deny
  conditions: json("conditions"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});