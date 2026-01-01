import { Router } from "express";
import {
    createPost,
    deleteFacebookPosts,
    deletePostById,
    dispatchPost,
    editFacebookPostById,
    editPostById,
    getAllPosts,
    getFacebookPosts,
    getPostById,
    getTwitterPosts,
} from "../controller/post.controller.js";
import { validatePlatform } from "../middleware/validatePlatform.js";

const router = Router();

// Getters
router.get("/", getAllPosts);
router.get("/twitter", getTwitterPosts);
router.get("/facebook", getFacebookPosts);
router.get("/:id", getPostById);

//Deleting posts
router.delete("/:id", deletePostById);
router.delete("/facebook/:id", deleteFacebookPosts);

// Updating posts
router.put("/:id", editPostById);
router.post("/facebook/:id", editFacebookPostById);

// Creating posts
router.post("/", validatePlatform, dispatchPost);

export { router as postRouter };
