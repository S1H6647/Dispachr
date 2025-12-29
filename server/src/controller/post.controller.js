import { request, response } from "express";
import postSchema from "../schema/post.schema.js";
import {
    createTweetService,
    getUserTweetsService,
} from "../services/twitter.service.js";
import {
    createFacebookPost,
    getFacebookPost,
} from "../services/facebook.service.js";

const getAllPosts = async (_, response) => {
    try {
        const posts = await postSchema.findAll();
        response.status(200).json({
            data: posts,
            message: "Successfully fetched all the posts.",
        });
        console.log("✅ All Posts successfully fetched");
    } catch (error) {
        console.error(`❌ Error in getAllPosts controller. ${error}`);
        response.status(500).json({ message: "Failed to fetch all posts." });
    }
};

const getTwiiterPosts = async (_, response) => {
    const userid = "1940761508780429316";
    try {
        const posts = await getUserTweetsService(userid);
        response.status(200).json(posts);
        console.log(posts);
    } catch (error) {
        console.error(`❌ Error in getTwiiterPosts controller. ${error}`);
        response
            .status(500)
            .json({ message: "Failed to fetch Twitter posts." });
    }
};

const getFacebookPosts = async (_, response) => {
    try {
        const posts = await getFacebookPost();

        // response.status(200).json({
        //     ...posts,
        // });

        response.status(200).json({
            data: posts.data,
        });
        console.log(posts);
    } catch (error) {
        console.error(`❌ Error in getFacebookPosts controller. ${error}`);
        response
            .status(500)
            .json({ message: "Failed to fetch Facebook posts." });
    }
};

const getPostById = async (request, response) => {
    try {
        const { id } = request.params;
        const post = await postSchema.findByPk(id);

        if (!post) {
            return response.status(404).json({ message: "Post not found." });
        }

        response.status(200).json({
            data: post,
            message: "Post successfully fetched.",
        });
        console.log(`✅ Post with id ${id} successfully fetched`);
    } catch (error) {
        console.error(`❌ Error in getPostById controller. ${error}`);
        response.status(500).json({ message: "Failed to fetch post." });
    }
};

const createPost = async (request, response) => {
    try {
        const { title, description } = request?.body;

        console.log(title, description);

        //` Checking whether the incoming data are null or not
        if (!title || !description) {
            return response.status(400).json({ message: "Invalid payload" });
        }

        const post = await postSchema.create({
            title,
            description,
        });

        response.status(201).json({
            data: post,
            message: "Post successfully created.",
        });

        console.log("✅ Post successfully created");
    } catch (error) {
        console.error(`❌ Error in createPost controller. ${error}`);
        response.status(500).json({ message: "Failed to create post." });
    }
};

const deletePostById = async (request, response) => {
    try {
        const { id } = request.params;
        const post = await postSchema.findByPk(id);

        if (!post) {
            return response.status(404).json({ message: "Post not found." });
        }

        // Delete
        await post.destroy();

        response.status(200).json({
            status: true,
            message: "Post successfully deleted",
        });
        console.log(`✅ Post with id ${id} successfully deleted`);
    } catch (error) {
        console.error(`❌ Failed to delete the post: ${error}`);
        response
            .status(500)
            .json({ status: false, message: "Failed to delete post." });
    }
};

const editPostById = async (request, response) => {
    try {
        const { id } = request.params;
        const { title, description } = request?.body;
        const post = await postSchema.findByPk(id);

        if (!post) {
            return response.status(404).json({ message: "Post not found." });
        }

        if (!title || !description) {
            return response.status(400).json({ message: "Invalid payload" });
        }

        // Delete
        await post.update({
            title: title ? title : post.title,
            description: description ? description : post.description,
        });

        response.status(200).json({
            data: post,
            message: "Post successfully updated",
        });
        console.log(`✅ Post with id ${id} successfully updated`);
    } catch (error) {
        console.error(`❌ Failed to delete the post`);
        response.status(500).json({ message: "Failed to update post." });
    }
};

// Dispatch post to selected platforms
const dispatchPost = async (request, response) => {
    try {
        const { title, description, platforms } = request.body;

        const results = {
            website: null,
            twitter: null,
            facebook: null,
        };

        var responseData = [];

        // Post to website (save to database)
        if (platforms.includes("website")) {
            try {
                const { title, description } = request?.body;

                console.log(title, description);

                //` Checking whether the incoming data are null or not
                if (!title || !description) {
                    return response
                        .status(400)
                        .json({ message: "Invalid payload" });
                }

                const post = await postSchema.create({
                    title,
                    description,
                });

                response.status(201).json({
                    data: post,
                    message: "Post successfully created.",
                });

                results.website = { success: true, data: post };
                console.log("✅ Post successfully created");
            } catch (error) {
                console.error(`❌ Error in createPost controller. ${error}`);
                response
                    .status(500)
                    .json({ message: "Failed to create post." });
            }
            console.log("✅ Post saved to website/database");
        }

        // Post to Twitter
        if (platforms.includes("twitter")) {
            const twitterResult = await createTweetService(title, description);
            results.twitter = twitterResult;
            console.log("✅ Post sent to Twitter");
            responseData.push(twitterResult);
        }

        // Post to Facebook
        if (platforms.includes("facebook")) {
            const facebookResult = await createFacebookPost(title, description);
            results.facebook = facebookResult;
            console.log(facebookResult);
            console.log("✅ Post sent to Facebook");
            responseData.push(facebookResult);
        }

        response.status(201).json({
            success: true,
            message: "Post dispatched to selected platforms",
            results: responseData,
        });
    } catch (error) {
        console.error(`❌ Error in dispatchPost controller: ${error}`);
        response.status(500).json({
            success: false,
            message: "Failed to dispatch post",
            error: error.message,
        });
    }
};

export {
    getAllPosts,
    getTwiiterPosts,
    getFacebookPosts,
    getPostById,
    createPost,
    deletePostById,
    editPostById,
    dispatchPost,
};
