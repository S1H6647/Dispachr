import emailQueue from "../queues/email.queue.js";

/**
 * Service to handle email related operations
 */
export const sendResetPasswordEmail = async (email, resetToken, fullName) => {
    const resetUrl = `${
        process.env.CLIENT_URL || "http://localhost:5173"
    }/auth/reset-password/${resetToken}`;

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
            <p>Hi ${fullName || "User"},</p>
            <p>You requested to reset your password for your Dispachr account. Click the button below to set a new password. This link will expire in 5 minutes.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
            <p style="word-break: break-all; color: #4F46E5;">${resetUrl}</p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #888; text-align: center;">&copy; ${new Date().getFullYear()} Dispachr. All rights reserved.</p>
        </div>
    `;

    await emailQueue.add("sendResetEmail", {
        to: email,
        subject: "Reset Your Password - Dispachr",
        html: htmlContent,
    });
};
