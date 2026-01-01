import express, { request, response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { postRouter } from "./src/routes/post.route.js";
import { getMyDataService } from "./src/services/twitter.service.js";
import { connection } from "./src/database/db.js";
import { userRouter } from "./src/routes/user.route.js";
import { authRouter } from "./src/routes/auth.route.js";
import writeLog from "./src/middleware/writeLog.js";
import { verifyUserToken } from "./src/middleware/verifyUserToken.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Write a log for accessing an api path & it's method
// app.use(writeLog);

app.get("/", (request, response) => {
    response.status(200).json({ message: "Server is running..." });
});

// Public debug route to resolve Twitter user data (no auth)
app.get("/api/twitter/debug-public", async (request, response) => {
    try {
        const me = await getMyDataService();
        return response.status(200).json(me);
    } catch (error) {
        console.error("❌ Error in public twitter debug:", error);
        return response
            .status(500)
            .json({ success: false, error: error.message });
    }
});

app.get("/api/check", verifyUserToken, (request, response) => {
    console.log(request.user);
    response.json({ message: "Checking..." });
});

app.use("/api/posts", verifyUserToken, postRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
    connection();
    console.log(`The server is running on http://localhost:${PORT}`);
});
