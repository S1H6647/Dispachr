/**
 * Redis Configuration
 *
 * This file sets up the Redis connection for BullMQ queue system.
 * BullMQ uses Redis as the backend for job queues.
 */

import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

/**
 * Create Redis connection instance
 * Uses environment variables for configuration or defaults to localhost
 */
const redisConnection = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null, // Required for BullMQ
    enableReadyCheck: false, // Required for BullMQ
    retryStrategy: (times) => {
        // Retry connection with exponential backoff
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

/**
 * Event listeners for Redis connection
 */
redisConnection.on("connect", () => {
    console.log("✅ Redis connected successfully");
});

redisConnection.on("error", (error) => {
    console.error("❌ Redis connection error:", error);
});

redisConnection.on("close", () => {
    console.log("⚠️ Redis connection closed");
});

export default redisConnection;
