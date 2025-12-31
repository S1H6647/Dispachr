import "dotenv/config";

// Facebook Graph API endpoint
const GRAPH_API_VERSION = "v23.0";
// const PAGE_ID = "884621454736122";
// const PAGE_ID = "918700091325713";

const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

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
        return {
            success: true,
            data: await fetchFacebookPosts(process.env.FB_ACCESS_TOKEN),
        };
    } catch (error) {
        console.error("❌ Error fetch posts from Facebook:", error.message);
        if (error.code === 190) {
            const newToken = await refreshAccessToken();
            return {
                success: true,
                data: await fetchFacebookPosts(newToken),
            };
        }

        return {
            success: false,
            message: error.message,
        };
    }
}

async function fetchFacebookPosts(accessToken) {
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/me/posts?access_token=${accessToken}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("Facebook : ", data);

    if (data.error) {
        throw data.error;
    }

    return data.data;
}

async function refreshAccessToken() {
    const url = `https://graph.facebook.com/v17.0/oauth/access_token
        ?grant_type=fb_exchange_token
        &client_id=${process.env.FB_APP_ID}
        &client_secret=${process.env.FB_APP_SECRET}
        &fb_exchange_token=${process.env.FB_ACCESS_TOKEN}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
        throw data.error;
    }

    // Save new token securely
    process.env.FB_ACCESS_TOKEN = data.access_token;

    return data.access_token;
}

/**
 * Delete a Facebook Post
 * @param {string} postId - The ID of the Facebook post to delete
 * @returns {object} - Facebook API response
 */
async function deleteFacebookPost(postId) {
    try {
        const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${postId}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
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
        return {
            success: true,
            message: "Post deleted successfully",
        };
    } catch (error) {
        console.error("❌ Error deleting Facebook post:", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
}

const updateFacebookPost = async (postId, newTitle, newDescription) => {
    try {
        const newText = `${newTitle}\n\n${newDescription}`;
        const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${postId}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: newText,
                access_token: ACCESS_TOKEN,
            }),
        });

        // Handle empty or non-JSON responses
        const text = await response.text();
        let data;

        try {
            data = text ? JSON.parse(text) : {};
        } catch (parseError) {
            console.error(
                "❌ Failed to parse Facebook API response:",
                parseError
            );
            return {
                success: false,
                message: "Invalid response from Facebook API",
            };
        }

        if (data.error) {
            console.error("❌ Facebook API Error:", data.error.message);
            return {
                success: false,
                message: data.error.message || "Facebook API error occurred",
            };
        }

        // Check if response indicates success (Facebook API might return success: true or just an id)
        if (!response.ok) {
            return {
                success: false,
                message: `Facebook API returned status ${response.status}`,
            };
        }

        console.log("✅ Facebook post updated successfully");
        return {
            success: true,
            postId: data.id || postId,
            message: "Post updated successfully",
        };
    } catch (error) {
        console.error("❌ Error updating the post:", error.message);
        return {
            success: false,
            message: error.message || "Failed to update Facebook post",
        };
    }
};

export {
    createFacebookPost,
    createFacebookPostWithImage,
    getFacebookPost,
    deleteFacebookPost,
    updateFacebookPost,
};
