import { Sequelize } from "sequelize";

const sequelize = new Sequelize("dispachr", "postgres", "076493", {
    host: "localhost",
    dialect: "postgres",
});

const connection = async () => {
    try {
        // await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log("✅ Database connection successfully established.");
    } catch (error) {
        console.error(`❌ Failed to connect to database. ${error}`);
    }
};

export { sequelize, connection };
