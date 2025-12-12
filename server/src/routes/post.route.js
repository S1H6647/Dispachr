import { Router } from "express";
import {
    createPost,
    deletePostById,
    getAllPosts,
    getPostById,
} from "../controller/post.controller.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/post", createPost);
router.post("/delete/:id", deletePostById);

export { router as postRouter };
