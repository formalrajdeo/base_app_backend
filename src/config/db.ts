// src/config/db.ts
import { createPool } from "mysql2/promise";
import { drizzle, MySql2DrizzleConfig } from "drizzle-orm/mysql2";
import * as rbac from "@/db/schema/rbac";
import * as auth from "@/db/schema/auth";
import * as posts from "@/db/schema/posts";
import * as abac from "@/db/schema/abac";
import { logger } from "@/lib/logger";

const combinedSchema = {
  ...rbac,
  ...auth,
  ...posts,
  ...abac,
};

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  connectionLimit: 10,
});

// Correct Drizzle config with required 'mode'
const config: MySql2DrizzleConfig<typeof combinedSchema> = {
  schema: combinedSchema,
  mode: "default"
};

export const db = drizzle(pool, config);

logger.info("MySQL connected via Drizzle ORM");