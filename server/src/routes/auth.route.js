import { Router } from "express";
import { login, logout } from "../controller/auth.controller.js";
import { loginValidator } from "../utils/user.validator.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);

export { router as authRouter };
