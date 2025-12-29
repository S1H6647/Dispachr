import "dotenv/config";

// Facebook Graph API endpoint
const GRAPH_API_VERSION = "v23.0";
// const PAGE_ID = "884621454736122";
// const PAGE_ID = "918700091325713";

const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

/**
 * Post to Facebook Page
 * @param {string} title - Post title
 * @param {string} description - Post description/content
 * @returns {object} - Facebook API response
 */
async function createFacebookPost(title, description) {
    try {
        const postURL = `https://graph.facebook.com/${GRAPH_API_VERSION}/me?access_token=${ACCESS_TOKEN}`;

        const postResponse = await fetch(postURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const postData = await postResponse.json();

        // console.log(postData.id);

        const postText = `${title}\n\n${description}`;
        const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${postData.id}/feed`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: postText,
                access_token: ACCESS_TOKEN,
            }),
        });

        const data = await response.json();

        if (data.error) {
            console.error("❌ Facebook API Error:", data.error.message);
            return {
                success: false,
                message: data.error.message,
            };
        }

        console.log("✅ Facebook post created successfully:", data.id);
        return {
            success: true,
            postId: data.id,
            message: "Post published to Facebook",
        };
    } catch (error) {
        console.error("❌ Error posting to Facebook:", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
}

/**
 * Post with an image to Facebook Page
 * @param {string} title - Post title
 * @param {string} description - Post description
 * @param {string} imageUrl - Public URL of the image
 */
async function createFacebookPostWithImage(title, description, imageUrl) {
    try {
        const postText = `${title}\n\n${description}`;
        const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PAGE_ID}/photos`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: postText,
                url: imageUrl,
                access_token: ACCESS_TOKEN,
            }),
        });

        const data = await response.json();

        if (data.error) {
            console.error("❌ Facebook API Error:", data.error.message);
            return {
                success: false,
                message: data.error.message,
            };
        }

        console.log("✅ Facebook photo post created:", data.id);
        return {
            success: true,
            postId: data.id,
            message: "Photo published to Facebook",
        };
    } catch (error) {
        console.error("❌ Error posting photo to Facebook:", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
}

async function getFacebookPost() {
    try {
        const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/me/posts?access_token=${ACCESS_TOKEN}`;
        const response = await fetch(url);

        const data = await response.json();

        return {
            success: true,
            data: data.data,
        };
    } catch (error) {
        console.error("❌ Error fetch posts from Facebook:", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
}

export { createFacebookPost, createFacebookPostWithImage, getFacebookPost };
