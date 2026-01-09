import { Router } from "express";
import {
    createPost,
    deleteFacebookPosts,
    deletePostById,
    deleteTweetById,
    dispatchPost,
    editFacebookPostById,
    editPostById,
    editTweetsById,
    getAllPosts,
    getFacebookPosts,
    getPostById,
    getPostChart,
    getTwitterPosts,
} from "../controller/post.controller.js";
import { validatePlatform } from "../middleware/validatePlatform.js";

const router = Router();

// Getters
router.get("/", getAllPosts);
router.get("/twitter", getTwitterPosts);
router.get("/facebook", getFacebookPosts);
router.get("/chart", getPostChart);
router.get("/:id", getPostById);

//Deleting posts
router.delete("/:id", deletePostById);
router.delete("/facebook/:id", deleteFacebookPosts);
router.delete("/twitter/:id", deleteTweetById);

// Updating posts
router.put("/:id", editPostById);
router.post("/facebook/:id", editFacebookPostById);
router.post("/twitter/:id", editTweetsById);

// Creating posts
router.post("/", validatePlatform, dispatchPost);

export { router as postRouter };
