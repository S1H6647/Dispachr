import { Router } from "express";
import {
    CheckPassword,
    createUser,
    deleteUserById,
    editUserById,
    getAllUser,
    getCurrentUser,
    getUserById,
} from "../controller/user.controller.js";
import { verifyUserToken } from "../middleware/verifyUserToken.js";

const router = Router();

router.get("/me", verifyUserToken, getCurrentUser);
router.get("/", getAllUser);
router.get("/:id", getUserById);
router.post("/", createUser);
router.delete("/:id", deleteUserById);
router.put("/:id", editUserById);
router.post("/checkPass", verifyUserToken, CheckPassword);

export { router as userRouter };
