import { DataTypes } from "sequelize";
import { sequelize } from "../database/db.js";

const postSchema = sequelize.define("Posts", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: false,
    },
    // image: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    // }, // Image URL

    platforms: {
        type: DataTypes.JSON,
        allowNull: true,
    }, // e.g., ["twitter", "facebook", "linkedin"]

    // status: {
    //     type: DataTypes.ENUM("draft", "scheduled", "published", "failed"),
    //     defaultValue: "draft",
    // },
    publishedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },

    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },

    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

export default postSchema;
