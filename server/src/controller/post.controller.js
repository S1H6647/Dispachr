import postSchema from "../schema/post.schema.js";

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
            await response.status(400).json({ message: "Invalid payload" });
        }

        const post = await postSchema.create({
            title,
            description,
        });

        response.status(200).json({
            data: post,
            message: "Successfully post created.",
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
            response.status(404).json({ message: "Post not found." });
        }

        // Delete
        await post.destroy();

        response.status(200).json({
            data: post,
            message: "Post successfully deleted",
        });
        console.log(`✅ Post with id ${id} successfully deleted`);
    } catch (error) {
        console.error(`❌ Failed to delete the post`);
        response.status(500).json({ message: "Failed to delete post." });
    }
};

const editPostById = async (request, response) => {
    try {
        const { id } = request.params;
        const { title, description } = response?.body;
        const post = await postSchema.findByPk(id);

        if (!post) {
            response.status(404).json({ message: "Post not found." });
        }

        if (!title || !description) {
            response.status(404).json({ message: "Invalid payload" });
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

export { getAllPosts, getPostById, createPost, deletePostById, editPostById };
