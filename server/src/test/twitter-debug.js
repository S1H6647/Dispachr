import "dotenv/config";
import crypto from "crypto";
import OAuth from "oauth-1.0a";

console.log("=== Twitter API Debug Tool ===\n");

// Step 1: Check environment variables
console.log("1️⃣ Checking environment variables:");
const config = {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_KEY_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    bearerToken: process.env.TWITTER_BEARER_TOKEN,
};

console.log(`   TWITTER_CONSUMER_KEY: ${config.consumerKey ? '✅ Set' : '❌ Missing'}`);
console.log(`   TWITTER_CONSUMER_KEY_SECRET: ${config.consumerSecret ? '✅ Set' : '❌ Missing'}`);
console.log(`   TWITTER_ACCESS_TOKEN: ${config.accessToken ? '✅ Set' : '❌ Missing'}`);
console.log(`   TWITTER_ACCESS_TOKEN_SECRET: ${config.accessTokenSecret ? '✅ Set' : '❌ Missing'}`);
console.log(`   TWITTER_BEARER_TOKEN: ${config.bearerToken ? '✅ Set (optional)' : '⚠️ Not set (optional)'}`);
console.log();

const allRequired = config.consumerKey && config.consumerSecret && config.accessToken && config.accessTokenSecret;

if (!allRequired) {
    console.error("❌ Cannot proceed: Required Twitter credentials are missing");
    console.error("\n📖 To fix this:");
    console.error("   1. Go to https://developer.twitter.com/en/portal/dashboard");
    console.error("   2. Create an app or select existing app");
    console.error("   3. Generate/copy API keys and tokens");
    console.error("   4. Add them to your .env file:");
    console.error("      TWITTER_CONSUMER_KEY=your_api_key");
    console.error("      TWITTER_CONSUMER_KEY_SECRET=your_api_secret");
    console.error("      TWITTER_ACCESS_TOKEN=your_access_token");
    console.error("      TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret");
    process.exit(1);
}

// Step 2: Test basic connectivity
console.log("2️⃣ Testing basic internet connectivity:");
try {
    const testResponse = await fetch("https://www.google.com", { 
        method: "HEAD",
        signal: AbortSignal.timeout(5000)
    });
    console.log(`   ✅ Internet connection OK (Status: ${testResponse.status})`);
} catch (error) {
    console.error(`   ❌ Internet connection failed: ${error.message}`);
    process.exit(1);
}
console.log();

// Step 3: Test Twitter API connectivity
console.log("3️⃣ Testing Twitter API connectivity:");
try {
    const twitterUrl = "https://api.twitter.com/2/";
    const testResponse = await fetch(twitterUrl, {
        signal: AbortSignal.timeout(5000)
    });
    console.log(`   ✅ Can reach api.twitter.com (Status: ${testResponse.status})`);
} catch (error) {
    console.error(`   ❌ Cannot reach api.twitter.com: ${error.message}`);
    if (error.message.includes("fetch failed")) {
        console.error("   Possible causes:");
        console.error("     - Firewall blocking requests");
        console.error("     - Proxy configuration needed");
        console.error("     - DNS issues");
    }
    process.exit(1);
}
console.log();

// Step 4: Test OAuth 1.0a signing
console.log("4️⃣ Setting up OAuth 1.0a:");
try {
    const oauth = OAuth({
        consumer: { key: config.consumerKey, secret: config.consumerSecret },
        signature_method: "HMAC-SHA1",
        hash_function: (base, key) =>
            crypto.createHmac("sha1", key).update(base).digest("base64"),
    });

    const token = {
        key: config.accessToken,
        secret: config.accessTokenSecret,
    };

    console.log(`   ✅ OAuth configured successfully`);
    console.log(`   Consumer key length: ${config.consumerKey.length}`);
    console.log(`   Access token length: ${config.accessToken.length}`);
    console.log();

    // Step 5: Test authenticated request to /users/me
    console.log("5️⃣ Testing authenticated request to /users/me:");
    const url = "https://api.twitter.com/2/users/me";
    const method = "GET";

    const authHeader = oauth.toHeader(oauth.authorize({ url, method }, token));

    const options = {
        method,
        headers: {
            Authorization: authHeader.Authorization,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    };

    console.log(`   Requesting: ${url}`);

    const response = await fetch(url, options);
    
    console.log(`   Response Status: ${response.status} ${response.statusText}`);
    console.log(`   Response Headers:`, Object.fromEntries(response.headers));

    const responseText = await response.text();
    console.log(`   Response length: ${responseText.length} bytes`);

    let data;
    try {
        data = JSON.parse(responseText);
    } catch (parseError) {
        console.error(`   ❌ Failed to parse response as JSON`);
        console.error(`   Response text: ${responseText.substring(0, 500)}`);
        throw parseError;
    }

    console.log(`   Response data:`, JSON.stringify(data, null, 2));

    if (data.errors) {
        console.error(`\n   ❌ Twitter API returned errors:`);
        data.errors.forEach((error, index) => {
            console.error(`   Error ${index + 1}:`);
            console.error(`     Title: ${error.title}`);
            console.error(`     Detail: ${error.detail}`);
            console.error(`     Type: ${error.type}`);
            console.error(`     Status: ${error.status || 'N/A'}`);
        });

        console.error(`\n   🔍 Troubleshooting tips:`);
        
        if (data.title === 'Unauthorized' || data.status === 401) {
            console.error(`   1. Verify your API keys are correct and complete`);
            console.error(`   2. Check if your app has "Read and Write" permissions`);
            console.error(`   3. Regenerate access tokens after changing permissions`);
            console.error(`   4. Make sure tokens haven't been revoked`);
            console.error(`   5. Verify your Twitter app is not suspended`);
            console.error(`\n   📖 How to regenerate tokens:`);
            console.error(`      - Go to https://developer.twitter.com/en/portal/projects-and-apps`);
            console.error(`      - Select your app > "Keys and tokens"`);
            console.error(`      - Click "Regenerate" for Access Token and Secret`);
        }
    } else if (data.data) {
        console.log(`\n   ✅ Successfully authenticated!`);
        console.log(`   User ID: ${data.data.id}`);
        console.log(`   Username: ${data.data.username || 'N/A'}`);
        console.log(`   Name: ${data.data.name || 'N/A'}`);

        // Step 6: Test fetching tweets
        console.log(`\n6️⃣ Testing tweet fetch for user ${data.data.id}:`);
        
        const tweetsUrl = `https://api.twitter.com/2/users/${data.data.id}/tweets?tweet.fields=created_at`;
        const tweetsAuthHeader = oauth.toHeader(oauth.authorize({ url: tweetsUrl, method: "GET" }, token));
        
        const tweetsResponse = await fetch(tweetsUrl, {
            method: "GET",
            headers: {
                Authorization: tweetsAuthHeader.Authorization,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        console.log(`   Response Status: ${tweetsResponse.status} ${tweetsResponse.statusText}`);
        
        const tweetsData = await tweetsResponse.json();
        
        if (tweetsData.errors) {
            console.error(`   ❌ Error fetching tweets:`, tweetsData.errors);
        } else {
            console.log(`   ✅ Successfully fetched tweets!`);
            console.log(`   Number of tweets: ${tweetsData.data?.length || 0}`);
            console.log(`   Has more: ${tweetsData.meta?.next_token ? 'Yes' : 'No'}`);
            
            if (tweetsData.data && tweetsData.data.length > 0) {
                console.log(`\n   Latest tweet:`);
                console.log(`     ID: ${tweetsData.data[0].id}`);
                console.log(`     Text: ${tweetsData.data[0].text?.substring(0, 100)}...`);
                console.log(`     Created: ${tweetsData.data[0].created_at}`);
            }
        }
    } else {
        console.warn(`   ⚠️ Unexpected response format`);
    }

} catch (error) {
    console.error(`\n   ❌ Error during OAuth test:`, error.message);
    console.error(`   Error stack:`, error.stack);
    
    if (error.message.includes("fetch failed")) {
        console.error("\n   ⚠️  Network-level failure detected!");
        console.error("   This usually means:");
        console.error("     1. No internet connection");
        console.error("     2. DNS can't resolve api.twitter.com");
        console.error("     3. Firewall/proxy blocking the connection");
        console.error("     4. SSL certificate issues");
        console.error("\n   Try running: ping api.twitter.com");
        console.error("   Or: curl -v https://api.twitter.com/2/");
    }
}

console.log("\n=== Debug Complete ===");
