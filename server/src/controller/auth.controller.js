import argon2 from "argon2";
import userSchema from "../schema/user.schema.js";
import jwt from "jsonwebtoken";
import { loginValidator } from "../utils/user.validator.js";
import { createToken } from "../middleware/createToken.js";
import { response } from "express";

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
        const tokenExpiry = isRemember ? "24h" : "10m";
        const accessToken = jwt.sign(
            userData,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: tokenExpiry }
        );

        // Set the cookie with the token
        createToken(response, accessToken, isRemember);

        response.status(200).json({
            data: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
            },
            accessToken: accessToken,
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

export { login, logout };
