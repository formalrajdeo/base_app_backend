// src/app.ts
import "dotenv/config";
import express from "express";
import http from "http";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import cors from "cors";
import hpp from "hpp";
import compression from "compression";

import roleRoutes from "@/modules/roles/role.routes.js";
import permissionRoutes from "@/modules/permissions/permission.routes.js";
import userRoutes from "@/modules/users/user.routes.js";
import postRoutes from "@/modules/posts/post.routes.js";

import { requestLogger } from "@/middleware/logger.js";
import { errorHandler } from "@/middleware/error.js";
import { logger } from "./lib/logger.js";

import { db } from "./config/db.js";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import resourceRoutes from "./modules/resources/resource.routes.js";
import { connectRedis, redis } from "./config/redis.js";
import { pool } from "./db/index.js";

const app = express();

// 🔐 TRUST PROXY (IMPORTANT for rate limit behind proxy like nginx)
app.set("trust proxy", 1);

// 🛡️ SECURITY MIDDLEWARES

// Secure HTTP headers
app.use(helmet());

// Enable CORS (adjust for prod)
app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    })
);

// Parse cookies
app.use(cookieParser());

// Prevent HTTP param pollution
app.use(hpp());

// Compress responses
app.use(compression());

// 🚦 RATE LIMITING
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // limit each IP
    standardHeaders: true,
    legacyHeaders: false,
});

if (process.env.NODE_ENV === "production") {
    app.use("/api", limiter);
}

// 🚐 BETTER AUTH ROUTE
// app.all('/api/auth/{*any}', toNodeHandler(auth));
// app.all("/api/auth/*", toNodeHandler(auth));
app.use("/api/auth", toNodeHandler(auth))

// 📦 BODY PARSER
app.use(express.json({ limit: "10kb" }));

// 🪵 REQUEST LOGGER
app.use(requestLogger);


// 🚏 ROUTES
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/resources", resourceRoutes);
app.use("/api/v1/permissions", permissionRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);

app.get("/", (req, res) => {
    res.send("Base backend is running!");
});

// 🚨 ERROR HANDLER
app.use(errorHandler);

// 🛠️ STARTUP FUNCTION: Test DB + Redis then start server
const startServer = async () => {
    try {
        // 1️⃣ Test MySQL connection
        await db.execute("SELECT 1");
        logger.info("✅ Database connected successfully");

        // 2️⃣ Test Redis connection
        await connectRedis();

        // 3️⃣ Start HTTP server
        const PORT = Number(process.env.PORT || 8000);
        const server = http.createServer(app);

        server.listen(PORT, () => {
            logger.info(`🚀 Server running on http://localhost:${PORT}`);
        });

        //
        // 🛑 GRACEFUL SHUTDOWN
        const shutdown = (signal: string) => {
            logger.warn(`⚠️ ${signal} received. Closing server...`);

            server.close(async () => {
                logger.info("HTTP server closed");
                try {
                    // Close DB pool if using one
                    await pool.end?.(); // optional depending on your db driver
                    await redis.quit(); // close Redis connection
                    logger.info("Cleanup done. Exiting...");
                    process.exit(0);
                } catch (err) {
                    logger.error("Shutdown error", err);
                    process.exit(1);
                }
            });

            setTimeout(() => {
                logger.error("Force shutdown");
                process.exit(1);
            }, 10000).unref();
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);
    } catch (err) {
        logger.error("❌ Startup failed", err);
        process.exit(1); // fail fast if DB or Redis fails
    }
};

// Kick off startup
startServer();

//
// PROCESS-LEVEL SAFETY
process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception", err);
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Rejection", reason);
    process.exit(1);
});