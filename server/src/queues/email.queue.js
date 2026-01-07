import { Queue } from "bullmq";
import redisConnection from "../config/redis.config.js";

/**
 * Create a new BullMQ queue for emails
 */
const emailQueue = new Queue("emailQueue", {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    },
});

export default emailQueue;
