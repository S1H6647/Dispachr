import { Worker } from "bullmq";
import redisConnection from "../config/redis.config.js";
import emailTransporter from "../config/email.config.js";

/**
 * Create a BullMQ worker to process email jobs
 */
const emailWorker = new Worker(
    "emailQueue",
    async (job) => {
        const { to, subject, html } = job.data;

        console.log(`📨 Processing email job ${job.id} for ${to}`);

        try {
            const info = await emailTransporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject,
                html,
            });

            console.log(`✅ Email sent: ${info.messageId}`);
            return info;
        } catch (error) {
            console.error(`❌ Failed to send email to ${to}:`, error);
            throw error; // Rethrow to let BullMQ handle retries
        }
    },
    {
        connection: redisConnection,
        concurrency: 5, // Process up to 5 emails in parallel
    }
);

emailWorker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} has completed!`);
});

emailWorker.on("failed", (job, err) => {
    console.log(`❌ Job ${job.id} has failed with ${err.message}`);
});

export default emailWorker;
