/**
 * Email Configuration
 *
 * This file configures nodemailer with SMTP settings.
 * Supports Gmail, Outlook, and other SMTP providers.
 */

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * Create nodemailer transporter
 * Uses environment variables for SMTP configuration
 */
const emailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // Your email address
        pass: process.env.SMTP_PASS, // Your email password or app-specific password
    },
    tls: {
        rejectUnauthorized: false, // Set to false for development, true for production
    },
});

/**
 * Verify email configuration
 * Call this once to verify the SMTP connection
 */
export const verifyEmailConfig = async () => {
    try {
        await emailTransporter.verify();
        console.log("✅ Email server is ready to send messages");
        return true;
    } catch (error) {
        console.error("❌ Email configuration error:", error);
        return false;
    }
};

export default emailTransporter;
