// src/config/redis.ts
import Redis from "ioredis";
import { logger } from "@/lib/logger.js";

const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1", // change to "redis" if running in Docker
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        return Math.min(times * 50, 2000);
    },
    enableReadyCheck: true,
    lazyConnect: true, // important for controlled connect
});

const connectRedis = async () => {
    try {
        await redis.connect(); // attempts connection
        await redis.ping(); // simple ping to test
        logger.info("✅ Redis connected successfully");
    } catch (err) {
        logger.error("❌ Redis connection failed", err);
        process.exit(1); // stop server if Redis fails
    }
};

export { redis, connectRedis };