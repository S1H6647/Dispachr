import jwt from "jsonwebtoken";
import userSchema from "../schema/user.schema.js";

export const verifyUserToken = async (request, response, next) => {
    try {
        const token = request.cookies["auth-token"];
        if (!token) {
            return response.status(401).json({ message: "No token" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const { id } = decoded;

        const user = await userSchema.findOne({ where: { id } });
        // console.log(user);

        if (user != null) {
            request.user = user.dataValues;
            next();
        } else {
            response.status(401).json({ message: "User unauthorized" });
        }
    } catch (error) {
        return response.status(401).json({ message: "Invalid token" });
    }
};
