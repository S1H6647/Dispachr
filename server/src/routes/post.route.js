import { Router } from "express";
import {
    createPost,
    deletePostById,
    dispatchPost,
    editPostById,
    getAllPosts,
    getFacebookPosts,
    getPostById,
    getTwiiterPosts,
} from "../controller/post.controller.js";
import { validatePlatform } from "../middleware/validatePlatform.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/twitter", getTwiiterPosts);
router.get("/facebook", getFacebookPosts);
router.get("/:id", getPostById);
// router.post("/", createPost);
router.delete("/:id", deletePostById);
router.put("/:id", editPostById);
router.post("/", validatePlatform, dispatchPost);

export { router as postRouter };
