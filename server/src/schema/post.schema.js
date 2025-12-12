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
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    // image: {
    //     type: DataTypes.STRING, // Store image URL
    //     allowNull: false,
    // },
});

export default postSchema;
