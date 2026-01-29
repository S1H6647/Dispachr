import crypto from "crypto";
import OAuth from "oauth-1.0a";
import {
    withCache,
    withStaleWhileRevalidate,
    CACHE_KEYS,
    invalidateTwitterCache,
    TWITTER_TTL,
} from "./cache.service.js";

// Twitter API Configuration (move to .env in production)
const config = {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_KEY_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
};

// Validate Twitter configuration on module load
if (!config.consumerKey || !config.consumerSecret || !config.accessToken || !config.accessTokenSecret) {
    console.warn("⚠️  Twitter API credentials are incomplete:");
    console.warn(`   TWITTER_CONSUMER_KEY: ${config.consumerKey ? '✅' : '❌ Missing'}`);
    console.warn(`   TWITTER_CONSUMER_KEY_SECRET: ${config.consumerSecret ? '✅' : '❌ Missing'}`);
    console.warn(`   TWITTER_ACCESS_TOKEN: ${config.accessToken ? '✅' : '❌ Missing'}`);
    console.warn(`   TWITTER_ACCESS_TOKEN_SECRET: ${config.accessTokenSecret ? '✅' : '❌ Missing'}`);
}

const BASE_URL = "https://api.twitter.com/2";

// OAuth 1.0a signing
const oauth = OAuth({
    consumer: { key: config.consumerKey, secret: config.consumerSecret },
    signature_method: "HMAC-SHA1",
    hash_function: (base, key) =>
        crypto.createHmac("sha1", key).update(base).digest("base64"),
});

// Token object for OAuth
const token = {
    key: config.accessToken,
    secret: config.accessTokenSecret,
};

/**
 * Make an authenticated request to Twitter API
 */
async function twitterRequest(endpoint, method = "GET", body = null) {
    const url = `${BASE_URL}${endpoint}`;

    const authHeader = oauth.toHeader(oauth.authorize({ url, method }, token));

    const options = {
        method,
        headers: {
            Authorization: authHeader.Authorization,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    };

    if (body && method !== "GET") {
        options.body = JSON.stringify(body);
    }

    console.log(`🔍 Twitter API Request: ${method} ${endpoint}`);
    
    const response = await fetch(url, options);
    
    console.log(`📡 Twitter API Response: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    
    // Log errors for debugging
    if (!response.ok || data.errors) {
        console.error(`❌ Twitter API Error Response:`, JSON.stringify(data, null, 2));
    }
    
    return data;
}

/**
 * Create a tweet
 */
export async function createTweetService(title, description) {
    try {
        const tweetText = `${title}\n\n${description}`;
        const data = await twitterRequest("/tweets", "POST", {
            text: tweetText,
        });

        if (data.errors) {
            console.error("❌ Twitter API Error:", data.errors);
            return { status: false, error: data.errors };
        }

        // Invalidate cache after creating a new tweet
        await invalidateTwitterCache();

        console.log("✅ Tweet created:", data.data?.id);
        return { status: true, data, message: "Post published to Twitter" };
    } catch (error) {
        console.error("❌ Error creating tweet:", error.message);
        return { status: false, error: error.message };
    }
}

/**
 * Update a tweet by deleting the old one and creating a new one
 * Note: Twitter API v2 doesn't support editing tweets (except Twitter Blue)
 * So we delete the old tweet and create a new one with updated content
 */
export async function updateTweetPost(tweetId, newTitle, newDescription) {
    try {
        console.log(`🔄 Updating tweet ${tweetId}...`);

        // Step 1: Delete the old tweet
        const deleteResult = await twitterRequest(
            `/tweets/${tweetId}`,
            "DELETE"
        );

        if (deleteResult.errors) {
            console.error(
                "❌ Failed to delete old tweet:",
                deleteResult.errors
            );
            return {
                status: false,
                error: deleteResult.errors,
                message: "Failed to delete old tweet",
            };
        }

        console.log("✅ Old tweet deleted successfully");

        // Step 2: Create a new tweet with updated content
        const newTweetText = `${newTitle}\n\n${newDescription}`;
        const createResult = await twitterRequest("/tweets", "POST", {
            text: newTweetText,
        });

        console.log("Create result:", createResult);

        if (createResult.errors) {
            console.error(
                "❌ Failed to create new tweet:",
                createResult.errors
            );
            return {
                status: false,
                error: createResult.errors,
                message: "Old tweet deleted but failed to create new tweet",
            };
        }

        const data = await twitterRequest("/users/me");
        const userId = data.data.id;

        // Invalidate cache after updating
        await invalidateTwitterCache(userId);

        console.log(
            "✅ Tweet updated successfully. New ID:",
            createResult.data?.id
        );
        return {
            status: true,
            data: createResult.data,
            message: "Tweet updated successfully",
        };
    } catch (error) {
        console.error("❌ Error updating tweet:", error.message);
        return {
            status: false,
            error: error.message,
            message: "Failed to update tweet",
        };
    }
}

/**
 * Delete a tweet by ID
 */
export async function deleteTweetService(tweetId) {
    try {
        const data = await twitterRequest(`/tweets/${tweetId}`, "DELETE");

        if (data.errors) {
            return { status: false, error: data.errors };
        }

        // Invalidate cache after deleting a tweet
        await invalidateTwitterCache();

        console.log("✅ Tweet deleted:", tweetId);
        return { status: true, data };
    } catch (error) {
        console.error("❌ Error deleting tweet:", error.message);
        return { status: false, error: error.message };
    }
}

/**
 * Get authenticated user's data (cached for 1 day, stale after 15 mins)
 */
export async function getMyDataService() {
    const cacheKey = CACHE_KEYS.TWITTER_MY_DATA;

    return withStaleWhileRevalidate(
        cacheKey,
        async () => {
            try {
                console.log("🚀 Fetching Twitter user data...");
                
                const data = await twitterRequest("/users/me");

                console.log("My data: ", data);
                
                // Check for errors first
                if (data.errors) {
                    console.error("❌ Twitter API returned errors:", data.errors);
                    return { status: false, error: data.errors };
                }
                
                // Check if data.data exists
                if (!data.data) {
                    console.error("❌ Twitter API response missing data field:", data);
                    
                    // Check for specific error types
                    if (data.title === 'Unauthorized' || data.status === 401) {
                        console.error("⚠️  401 Unauthorized - Check your Twitter API credentials:");
                        console.error("   - TWITTER_CONSUMER_KEY");
                        console.error("   - TWITTER_CONSUMER_KEY_SECRET");
                        console.error("   - TWITTER_ACCESS_TOKEN");
                        console.error("   - TWITTER_ACCESS_TOKEN_SECRET");
                        return { status: false, error: "Twitter authentication failed: Invalid or expired credentials" };
                    }
                    
                    return { status: false, error: "Invalid response from Twitter API" };
                }

                console.log("✅ Twitter user ID: ", data.data.id);
                return { status: true, data: data.data.id };
            } catch (error) {
                console.error("❌ Error fetching user data:", error.message);
                return { status: false, error: error.message };
            }
        }
        // Uses default TWITTER_TTL (1 day) and TWITTER_STALE_TIME (15 mins)
    );
}

/**
 * Get all tweets for a user (cached for 1 day, stale after 15 mins)
 * Uses stale-while-revalidate: returns cached data immediately,
 * but fetches fresh data in background if cache is older than 15 mins.
 */
export async function getUserTweetsService(userId) {
    const cacheKey = `${CACHE_KEYS.TWITTER_TWEETS}:${userId}`;

    return withStaleWhileRevalidate(
        cacheKey,
        async () => {
            try {
                const bearerToken = process.env.TWITTER_BEARER_TOKEN;
                const options = {
                    method: "GET",
                    headers: { Authorization: `Bearer ${bearerToken}` },
                };

                const response = await fetch(
                    `${BASE_URL}/users/${userId}/tweets?tweet.fields=created_at`,
                    options
                );
                const data = await response.json();

                console.log("Twitter data: ", data);

                if (data.errors) {
                    return { status: false, error: data.errors };
                }

                return { status: true, data: data.data };
            } catch (error) {
                console.error("❌ Error fetching tweets:", error.message);
                return { status: false, error: error.message };
            }
        }
        // Uses default TWITTER_TTL (1 day) and TWITTER_STALE_TIME (15 mins)
    );
}
