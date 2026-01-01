import postSchema from "../schema/post.schema.js";
import {
    createTweetService,
    getMyDataService,
    getUserTweetsService,
} from "../services/twitter.service.js";
import {
    createFacebookPost,
    deleteFacebookPost,
    getFacebookPost,
    updateFacebookPost,
} from "../services/facebook.service.js";
import { caplitalizeFirstWord } from "../utils/user.caplitalize.js";

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

const getTwitterPosts = async (_, response) => {
    const userid = "1940761508780429316";
    try {
        const myData = await getMyDataService();

        console.log(myData);

        const userId = myData.data.id;

        const posts = await getUserTweetsService(userId);
        response.status(200).json(posts);
        console.log(posts);
    } catch (error) {
        console.error(`❌ Error in getTwitterPosts controller. ${error}`);
        response
            .status(500)
            .json({ message: "Failed to fetch Twitter posts." });
    }
};

const getFacebookPosts = async (_, response) => {
    try {
        const posts = await getFacebookPost();

        // console.log(`Facebook Posts: ${posts}`);

        response.status(200).json({
            data: posts.data,
        });
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
            title: caplitalizeFirstWord(title),
            description: caplitalizeFirstWord(description),
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

const deleteFacebookPosts = async (request, response) => {
    try {
        const { id: postId } = request.params;

        if (!postId) {
            return response.status(400).json({
                status: false,
                message: "No Facebook postId provided.",
            });
        }

        console.log(`Facebook post id : ${postId}`);

        const deletedPost = deleteFacebookPost(postId);

        console.log("Delete message: ", deletedPost);

        if (deletedPost.success) {
            response
                .status(200)
                .json({ status: true, message: deletedPost.message });
        } else {
            response
                .status(500)
                .json({ status: false, message: deletedPost.message });
        }
    } catch (error) {
        console.error(`❌ Failed to delete the Facebook post: ${error}`);
        response.status(500).json({
            status: false,
            message: "Failed to delete Facebook post.",
        });
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
            title: caplitalizeFirstWord(title) ? title : post.title,
            description: description ? description : post.description,
        });

        response.status(200).json({
            status: true,
            message: "Post successfully updated",
        });
        console.log(`✅ Post with id ${id} successfully updated`);
    } catch (error) {
        console.error(`❌ Failed to delete the post`);
        response.status(500).json({ message: "Failed to update post." });
    }
};

const editFacebookPostById = async (request, response) => {
    try {
        const { id: postId } = request.params;
        const { newTitle, newDescription } = request.body;

        if (!postId) {
            return response.status(400).json({
                status: false,
                message: "No Facebook postId provided.",
            });
        }

        if (!newTitle || !newDescription) {
            return response.status(400).json({
                status: false,
                message: "Both newTitle and newDescription are required.",
            });
        }

        const updatedPost = await updateFacebookPost(
            postId,
            newTitle,
            newDescription
        );

        if (updatedPost.success) {
            response
                .status(200)
                .json({ status: true, message: updatedPost.message });
        } else {
            response
                .status(500)
                .json({ status: false, message: updatedPost.message });
        }
    } catch (error) {
        console.error(`❌ Failed to update Facebook post: ${error}`);
        response.status(500).json({
            status: false,
            message: "Failed to update Facebook post.",
        });
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
    getTwitterPosts,
    getFacebookPosts,
    getPostById,
    createPost,
    deletePostById,
    editPostById,
    editFacebookPostById,
    dispatchPost,
    deleteFacebookPosts,
};
