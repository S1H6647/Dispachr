import { DataTypes } from "sequelize";
import { sequelize } from "../database/db.js";

const userSchema = sequelize.define(
    "Users",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        accountType: {
            type: DataTypes.ENUM("LOCAL", "GOOGLE"),
            allowNull: false,
            defaultValue: "LOCAL",
        },
    },
    {
        defaultScope: {
            attributes: {
                exclude: ["password"],
            },
        },
        scopes: {
            withPassword: {
                attributes: {
                    include: ["password"],
                },
            },
        },
    }
);

export default userSchema;
