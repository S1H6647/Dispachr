import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { postRouter } from "./src/routes/post.route.js";
import { connection } from "./src/database/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
    response.status(200).json({ message: "Server is running..." });
});

app.use("/posts", postRouter);

app.listen(PORT, () => {
    connection();
    console.log(`The server is running on http://localhost:${PORT}`);
});
