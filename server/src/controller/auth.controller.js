import argon2 from "argon2";
import userSchema from "../schema/user.schema.js";
import jwt from "jsonwebtoken";
import { loginValidator } from "../utils/user.validator.js";
import { createToken } from "../middleware/createToken.js";
import { response } from "express";
import { sendResetPasswordEmail } from "../services/email.service.js";

const login = async (request, response) => {
    try {
        const body = request?.body || {};

        //` Validate email and password using zod
        const { success, data, error } = loginValidator.safeParse(body);

        if (!success) {
            return response.status(400).json({
                status: false,
                message: "Validation failed",
                error: error.errors,
            });
        }

        const { email, password, isRemember } = data;
        console.log(email, password, isRemember);

        //` Check user from db
        const user = await userSchema.scope("withPassword").findOne({
            where: { email },
        });

        //` Check if user exists
        if (!user) {
            return response
                .status(401)
                .json({ status: false, message: "The user doesn't exist!" });
        }

        //` Validate password
        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            return response
                .status(401)
                .json({ status: false, message: "Invalid password." });
        }

        const userData = { id: user.id, email: user.email };
        const tokenExpiry = isRemember ? "24h" : "2d";
        const accessToken = jwt.sign(
            userData,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: tokenExpiry }
        );

        console.log(`Login accessToken: ${accessToken}`);

        // Set the cookie with the token
        createToken(response, accessToken, isRemember);

        response.status(200).json({
            data: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
            },
            status: true,
            message: "Login successful",
        });
        console.log(`✅ Login successful.`);
    } catch (error) {
        console.error(`❌ Error in login controller. ${error}`);
        response.status(500).json({
            status: false,
            message: error.message || "Failed to login ",
        });
    }
};

const logout = async (_, response) => {
    try {
        response.clearCookie("auth-token", {
            secure: true,
            httpOnly: true,
            path: "/",
            sameSite: "lax",
        });

        response.status(200).json({
            status: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error(`❌ Error in loggout controller. ${error}`);
        response.status(500).json({
            message: error.message || "Failed to loggout ",
        });
    }
};

const forgetPassword = async (request, response) => {
    try {
        const { email } = request.body;
        if (!email) {
            return response.status(400).json({
                success: false,
                message: "Invalid payload",
            });
        }

        const user = await userSchema.findOne({ where: { email } });

        if (!user) {
            return response.status(404).json({
                success: false,
                message:
                    "We couldn't find an account associated with this email.",
            });
        }

        // send email with url /api/auth/reset-password/:token
        // where :token = jwt
        // jwt includes user.id, user.email

        const userData = {
            id: user.id,
            email: user.email,
        };

        const accessToken = jwt.sign(
            userData,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "5m" }
        );

        console.log(`Reset Password accessToken: ${accessToken}`);

        // Send email using BullMQ
        await sendResetPasswordEmail(user.email, accessToken, user.fullName);

        response.status(200).json({
            data: {
                email: user.email,
            },
            status: true,
            message: "A password reset link has been sent to your email.",
        });
    } catch (error) {
        console.error(`❌ Error in forgotPassword controller. ${error}`);
        response.status(500).json({
            message: error.message || "Failed to reset password ",
        });
    }
};

const resetPassword = async (request, response) => {
    try {
        const { newPassword, confirmPassword } = request.body;
        const { token } = request.params;

        if (!token) {
            return response.status(400).json({
                success: false,
                message: "Token missing",
            });
        }

        if (!newPassword || !confirmPassword) {
            return response.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            return response.status(401).json({
                success: false,
                message: "Invalid or expired reset token",
            });
        }

        const user = await userSchema.findByPk(decoded.id);
        if (!user) {
            return response.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Hash new password
        const hashedPassword = await argon2.hash(newPassword);

        // Update user password
        await user.update({ password: hashedPassword });

        response.status(200).json({
            status: true,
            message:
                "Password has been reset successfully. You can now log in.",
        });
    } catch (error) {
        console.error(`❌ Error in resetPassword controller. ${error}`);
        response.status(500).json({
            status: false,
            message: error.message || "Failed to reset password",
        });
    }
};

export { login, logout, forgetPassword, resetPassword };
