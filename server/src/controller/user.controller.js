import { email } from "zod";
import userSchema from "../schema/user.schema.js";
import argon2 from "argon2";
import { caplitalizeEachWord } from "../utils/user.caplitalize.js";

const getAllUser = async (_, response) => {
    try {
        const users = await userSchema.findAll();

        response.status(200).json({
            data: users,
            message: "Successfully fetched all users.",
        });
    } catch (error) {
        console.error(`❌ Error in getALlUser controller.`);
        response.status(500).json({ message: "Failed to fetch all users" });
    }
};

const getUserById = async (request, response) => {
    try {
        const { id } = request.params;
        const user = await userSchema.findByPk(id);

        if (!user) {
            return response.status(404).json({ message: "User not found." });
        }

        response.status(200).json({
            data: user,
            message: `User successfully fetched.`,
        });
        console.log(`✅ Post with id ${id} successfully fetched`);
    } catch (error) {
        console.error(`❌ Error in getUserById controller.`);
        response.status(500).json({ message: "Failed to fetch user" });
    }
};

const createUser = async (request, response) => {
    try {
        var { fullName, email, password, confirmPassword } = request?.body;

        console.log(fullName, email, password, confirmPassword);

        //` Checking whether the incoming data are null or not
        if (!fullName || !email || !password || !confirmPassword) {
            return response.status(400).json({ message: "Invalid payload" });
        }

        //` Authentication before adding to the db
        if (password !== confirmPassword) {
            return response
                .status(400)
                .json({ message: "Password did not match." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return response.status(400).json({ message: "Invalid email." });
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return response.status(400).json({
                message:
                    "Password must be at least 8 characters with uppercase, lowercase, number, and special character.",
            });
        }

        const existingUser = await userSchema.findOne({
            where: { email: email.toLowerCase() },
        });
        if (existingUser) {
            return response
                .status(409)
                .json({ message: "Email already registered." });
        }

        const hashedPassword = await argon2.hash(password);

        const userData = await userSchema.create({
            fullName: caplitalizeEachWord(fullName),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
        });

        response.status(201).json({
            data: {
                id: userData.id,
                fullName: userData.fullName,
                email: userData.email,
            },
            status: true,
            message: "User successfully created.",
        });

        console.log("✅ User successfully created");
    } catch (error) {
        console.error(`❌ Error in createUser controller. ${error}`);
        response.status(500).json({ message: "Failed to create user." });
    }
};

const deleteUserById = async (request, response) => {
    try {
        const { id } = request.params;
        const user = await userSchema.findByPk(id);

        if (!user) {
            return response.status(404).json({ message: "User not found." });
        }

        await user.destroy();

        response.status(200).json({
            data: user,
            message: `User successfully deleted.`,
        });
        console.log(`✅ Post with id ${id} successfully deleted`);
    } catch (error) {
        console.error(`❌ Error in deleteUserById controller.`);
        response.status(500).json({ message: "Failed to delete user" });
    }
};

const editUserById = async (request, response) => {
    try {
        const { id } = request.params;
        const { fullName, email } = request.body;
        const user = await userSchema.findByPk(id);

        if (!user) {
            return response.status(404).json({ message: "User not found." });
        }

        await user.update({
            fullName: fullName ? fullName.toLowerCase().trim() : user.fullName,
            email: email ? email.toLowerCase().trim() : user.email,
        });
        response.status(200).json({
            data: user,
            message: `User successfully updated.`,
        });
        console.log(`✅ Post with id ${id} successfully updated`);
    } catch (error) {
        console.error(`❌ Error in editUserById controller.`);
        response.status(500).json({ message: "Failed to edit user" });
    }
};

const getCurrentUser = async (request, response) => {
    try {
        const user = request.user;

        response.status(200).json({
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
            },
            status: true,
        });
    } catch (error) {
        console.error(`❌ Error in getCurrentUser controller.`);
        response
            .status(500)
            .json({ status: false, message: "Failed to get the current user" });
    }
};

const usersPost = async (request, response) => {};

export {
    getAllUser,
    getUserById,
    createUser,
    deleteUserById,
    editUserById,
    getCurrentUser,
};
