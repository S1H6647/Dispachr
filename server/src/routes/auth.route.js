import { Router } from "express";
import {
    forgetPassword,
    googleLogin,
    login,
    logout,
    resetPassword,
} from "../controller/auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/google", googleLogin);

export { router as authRouter };
