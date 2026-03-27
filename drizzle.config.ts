// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    // 🔹 Database dialect
    dialect: "mysql",

    // 🔹 Path to your Drizzle schema files
    schema: "./src/db/schema/**/*.ts",

    // 🔹 Folder where migration files will be generated
    out: "./drizzle",

    // 🔹 Database connection credentials (required for MySQL)
    dbCredentials: {
        url: process.env.DATABASE_URL!, // e.g. mysql://root:password@localhost:3306/base_app
    },

    // 🔹 Optional settings
    breakpoints: true,   // needed for MySQL to handle multiple DDL statements
    strict: false,       // disable SQL confirmation prompts
    verbose: true,       // print SQL statements during push/generate
});