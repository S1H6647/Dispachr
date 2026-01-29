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
                status: false,
                message: data.error.message,
            };
        }

        console.log("✅ Facebook post created successfully:", data.id);
        return {
            status: true,
            postId: data.id,
            message: "Post published to Facebook",
        };
    } catch (error) {
        console.error("❌ Error posting to Facebook:", error.message);
        return {
            status: false,
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
                status: false,
                message: data.error.message,
            };
        }

        console.log("✅ Facebook photo post created:", data.id);
        return {
            status: true,
            postId: data.id,
            message: "Photo published to Facebook",
        };
    } catch (error) {
        console.error("❌ Error posting photo to Facebook:", error.message);
        return {
            status: false,
            message: error.message,
        };
    }
}

async function getFacebookPost() {
    try {
        console.log("🚀 Starting Facebook posts fetch...");
        
        // Check if access token is configured
        if (!process.env.FB_ACCESS_TOKEN) {
            throw new Error("FB_ACCESS_TOKEN is not configured in environment variables");
        }

        const posts = await fetchFacebookPosts(process.env.FB_ACCESS_TOKEN);
        
        return {
            status: true,
            data: posts,
        };
    } catch (error) {
        console.error("❌ Error fetch posts from Facebook:", error.message);
        console.error("Full error object:", error);
        
        // Parse error to check for token expiration
        let errorCode = null;
        let isTokenExpired = false;
        
        // Try to extract error code from the error message (which contains the JSON response)
        if (error.message && error.message.includes('"code":190')) {
            errorCode = 190;
            isTokenExpired = true;
        }
        
        // Also check if error object has the code directly
        if (error.code === 190 || (error.error && error.error.code === 190)) {
            errorCode = 190;
            isTokenExpired = true;
        }
        
        // Handle token expiration
        if (isTokenExpired) {
            console.log("🔄 Access token expired, attempting to refresh...");
            try {
                const newToken = await refreshAccessToken();
                console.log("✅ Token refreshed successfully");
                return {
                    status: true,
                    data: await fetchFacebookPosts(newToken),
                };
            } catch (refreshError) {
                console.error("❌ Failed to refresh token:", refreshError.message);
                return {
                    status: false,
                    message: "Failed to refresh expired access token: " + refreshError.message,
                };
            }
        }

        return {
            status: false,
            message: error.message,
        };
    }
}

async function fetchFacebookPosts(accessToken) {
    try {
        // Debug: Check if access token exists
        if (!accessToken) {
            throw new Error("Access token is missing");
        }

        const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/me/posts?access_token=${accessToken}`;
        
        // Debug: Log the request (without exposing full token)
        console.log(`🔍 Fetching Facebook posts from: ${GRAPH_API_VERSION}/me/posts`);
        console.log(`🔍 Token exists: ${!!accessToken}, Token length: ${accessToken?.length || 0}`);

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Dispachr/1.0'
            },
            signal: AbortSignal.timeout(15000) // 15 second timeout
        });

        // Debug: Log response status
        console.log(`📡 Facebook API Response Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Facebook API Error Response: ${errorText}`);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("✅ Facebook posts fetched successfully. Count:", data.data?.length || 0);

        if (data.error) {
            console.error("❌ Facebook API returned error:", JSON.stringify(data.error, null, 2));
            throw data.error;
        }

        return data.data;
    } catch (error) {
        // Enhanced error logging
        console.error("❌ fetchFacebookPosts detailed error:");
        console.error("  Error name:", error.name);
        console.error("  Error message:", error.message);
        console.error("  Error code:", error.code);
        
        if (error.cause) {
            console.error("  Error cause:", error.cause);
        }

        // Check for timeout errors
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
            console.error("⚠️  Request timeout detected.");
            console.error("   The Facebook API did not respond within 15 seconds.");
            console.error("   Possible causes:");
            console.error("   - Slow network connection");
            console.error("   - Facebook API is experiencing issues");
            console.error("   - Request is being rate limited");
        }

        // Check for common issues
        if (error.message.includes("fetch failed")) {
            console.error("⚠️  Network error detected. Possible causes:");
            console.error("   - No internet connection");
            console.error("   - DNS resolution failure");
            console.error("   - Firewall blocking the request");
            console.error("   - SSL/TLS certificate issues");
        }

        throw error;
    }
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
                status: false,
                message: data.error.message,
            };
        }
        return {
            status: true,
            message: "Post deleted successfully",
        };
    } catch (error) {
        console.error("❌ Error deleting Facebook post:", error.message);
        return {
            status: false,
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
                status: false,
                message: "Invalid response from Facebook API",
            };
        }

        if (data.error) {
            console.error("❌ Facebook API Error:", data.error.message);
            return {
                status: false,
                message: data.error.message || "Facebook API error occurred",
            };
        }

        // Check if response indicates status (Facebook API might return status: true or just an id)
        if (!response.ok) {
            return {
                status: false,
                message: `Facebook API returned status ${response.status}`,
            };
        }

        console.log("✅ Facebook post updated successfully");
        return {
            status: true,
            postId: data.id || postId,
            message: "Post updated successfully",
        };
    } catch (error) {
        console.error("❌ Error updating the post:", error.message);
        return {
            status: false,
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
