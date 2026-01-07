import crypto from "crypto";
import OAuth from "oauth-1.0a";

// Twitter API Configuration (move to .env in production)
const config = {
    consumerKey:
        process.env.TWITTER_CONSUMER_KEY || "cbtGvgbm5CBeXC7zeW21ralAO",
    consumerSecret:
        process.env.TWITTER_CONSUMER_SECRET ||
        "aVv2TenQHxpEDdI8gbf1RGgIcDTNtuUK05BNWYQyPE7NQM1pIA",
    accessToken:
        process.env.TWITTER_ACCESS_TOKEN ||
        "1940761508780429316-FscJFddzBax2BtvPsdA99l3q5QmeXg",
    accessTokenSecret:
        process.env.TWITTER_ACCESS_TOKEN_SECRET ||
        "urUXgGbaksSdgm0pSGGrZXeGZTeiEfbQldMdnAJpxhHy4",
};

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

    const response = await fetch(url, options);
    return response.json();
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

        console.log("✅ Tweet created:", data.data?.id);
        return { status: true, data, message: "Post published to Twitter" };
    } catch (error) {
        console.error("❌ Error creating tweet:", error.message);
        return { status: false, error: error.message };
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

        console.log("✅ Tweet deleted:", tweetId);
        return { status: true, data };
    } catch (error) {
        console.error("❌ Error deleting tweet:", error.message);
        return { status: false, error: error.message };
    }
}

/**
 * Get authenticated user's data
 */
export async function getMyDataService() {
    try {
        const data = await twitterRequest("/users/me");

        if (data.errors) {
            return { status: false, error: data.errors };
        }

        return { status: true, data: data.data };
    } catch (error) {
        console.error("❌ Error fetching user data:", error.message);
        return { status: false, error: error.message };
    }
}

/**
 * Get all tweets for a user
 */
export async function getUserTweetsService(userId) {
    try {
        const bearerToken = process.env.TWITTER_BEARER_TOKEN;
        const options = {
            method: "GET",
            headers: { Authorization: `Bearer ${bearerToken}` },
        };

        const response = await fetch(
            `${BASE_URL}/users/${userId}/tweets`,
            options
        );
        const data = await response.json();

        console.log(data);

        // const data = await twitterRequest(`/users/${userId}/tweets`);

        if (data.errors) {
            return { status: false, error: data.errors };
        }

        return { status: true, data: data.data };
    } catch (error) {
        console.error("❌ Error fetching tweets:", error.message);
        return { status: false, error: error.message };
    }
}
