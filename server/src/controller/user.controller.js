import userSchema from "../schema/user.schema";
import { argon2id } from "argon2";

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
            response.status(404).json({ message: "User not found." });
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
            await response.status(400).json({ message: "Invalid payload" });
        }

        //` Authentication before adding to the db
        if (password !== confirmPassword) {
            response.status(400).json({ message: "Password did not match." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            response.status(400).json({ message: "Invalid email." });
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            response.status(400).json({
                message:
                    "Password must be at least 8 characters with uppercase, lowercase, number, and special character.",
            });
        }

        const existingUser = await userSchema.findOne({
            where: { email: email.toLowerCase() },
        });
        if (existingUser) {
            response.status(400).json({ message: "Email already registered." });
        }

        const hashedPassword = await argon2id.hash(password);

        const userData = await userSchema.create({
            fullName: fullName.toLowerCase(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
        });

        response.status(200).json({
            data: {
                id: userData.id,
                fullName: userData.fullName,
                email: userData.email,
            },
            message: "Successfully user created.",
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
            response.status(404).json({ message: "User not found." });
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
            response.status(404).json({ message: "User not found." });
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

export { getAllUser, getUserById, createUser, deleteUserById, editUserById };
