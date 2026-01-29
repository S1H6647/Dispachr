import "dotenv/config";

const GRAPH_API_VERSION = "v23.0";
const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

console.log("=== Facebook API Debug Tool ===\n");

// Step 1: Check environment variables
console.log("1️⃣ Checking environment variables:");
console.log(`   FB_ACCESS_TOKEN: ${ACCESS_TOKEN ? '✅ Set' : '❌ Missing'}`);
console.log(`   Token length: ${ACCESS_TOKEN?.length || 0}`);
console.log(`   FB_APP_ID: ${process.env.FB_APP_ID ? '✅ Set' : '❌ Missing'}`);
console.log(`   FB_APP_SECRET: ${process.env.FB_APP_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log();

if (!ACCESS_TOKEN) {
    console.error("❌ Cannot proceed: FB_ACCESS_TOKEN is missing");
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

// Step 3: Test Facebook Graph API connectivity
console.log("3️⃣ Testing Facebook Graph API connectivity:");
try {
    const graphUrl = "https://graph.facebook.com/";
    const testResponse = await fetch(graphUrl, {
        signal: AbortSignal.timeout(5000)
    });
    console.log(`   ✅ Can reach graph.facebook.com (Status: ${testResponse.status})`);
} catch (error) {
    console.error(`   ❌ Cannot reach graph.facebook.com: ${error.message}`);
    if (error.message.includes("fetch failed")) {
        console.error("   Possible causes:");
        console.error("     - Firewall blocking requests");
        console.error("     - Proxy configuration needed");
        console.error("     - DNS issues");
    }
    process.exit(1);
}
console.log();

// Step 4: Test access token validity
console.log("4️⃣ Testing access token validity:");
try {
    const debugUrl = `https://graph.facebook.com/debug_token?input_token=${ACCESS_TOKEN}&access_token=${ACCESS_TOKEN}`;
    const debugResponse = await fetch(debugUrl, {
        signal: AbortSignal.timeout(10000)
    });
    
    console.log(`   Response Status: ${debugResponse.status}`);
    
    const debugData = await debugResponse.json();
    
    if (debugData.error) {
        console.error(`   ❌ Token validation error: ${debugData.error.message}`);
        console.error(`   Error code: ${debugData.error.code}`);
        console.error(`   Error type: ${debugData.error.type}`);
    } else if (debugData.data) {
        console.log(`   ✅ Token is valid`);
        console.log(`   App ID: ${debugData.data.app_id}`);
        console.log(`   User ID: ${debugData.data.user_id || 'N/A'}`);
        console.log(`   Expires: ${debugData.data.expires_at ? new Date(debugData.data.expires_at * 1000).toLocaleString() : 'Never'}`);
        console.log(`   Is valid: ${debugData.data.is_valid}`);
        console.log(`   Scopes: ${debugData.data.scopes?.join(', ') || 'None'}`);
    }
} catch (error) {
    console.error(`   ❌ Failed to validate token: ${error.message}`);
}
console.log();

// Step 5: Test getting user/page info
console.log("5️⃣ Testing user/page info retrieval:");
try {
    const meUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/me?access_token=${ACCESS_TOKEN}`;
    const meResponse = await fetch(meUrl, {
        signal: AbortSignal.timeout(10000)
    });
    
    console.log(`   Response Status: ${meResponse.status}`);
    
    const meData = await meResponse.json();
    
    if (meData.error) {
        console.error(`   ❌ Error: ${meData.error.message}`);
        console.error(`   Error code: ${meData.error.code}`);
        console.error(`   Error type: ${meData.error.type}`);
    } else {
        console.log(`   ✅ Successfully retrieved user/page info`);
        console.log(`   ID: ${meData.id}`);
        console.log(`   Name: ${meData.name || 'N/A'}`);
    }
} catch (error) {
    console.error(`   ❌ Failed to get user info: ${error.message}`);
}
console.log();

// Step 6: Test fetching posts
console.log("6️⃣ Testing posts retrieval:");
try {
    const postsUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/me/posts?access_token=${ACCESS_TOKEN}`;
    console.log(`   Requesting: ${GRAPH_API_VERSION}/me/posts`);
    
    const postsResponse = await fetch(postsUrl, {
        signal: AbortSignal.timeout(15000),
        headers: {
            'User-Agent': 'Dispachr/1.0'
        }
    });
    
    console.log(`   Response Status: ${postsResponse.status} ${postsResponse.statusText}`);
    console.log(`   Response Headers:`, Object.fromEntries(postsResponse.headers));
    
    const responseText = await postsResponse.text();
    console.log(`   Response length: ${responseText.length} bytes`);
    
    const postsData = JSON.parse(responseText);
    
    if (postsData.error) {
        console.error(`   ❌ Error: ${postsData.error.message}`);
        console.error(`   Error code: ${postsData.error.code}`);
        console.error(`   Error type: ${postsData.error.type}`);
        console.error(`   Error subcode: ${postsData.error.error_subcode || 'N/A'}`);
        
        if (postsData.error.code === 190) {
            console.error(`   ⚠️  Token is expired or invalid`);
        } else if (postsData.error.code === 200) {
            console.error(`   ⚠️  Permission error - check token permissions`);
        }
    } else {
        console.log(`   ✅ Successfully retrieved posts`);
        console.log(`   Number of posts: ${postsData.data?.length || 0}`);
        
        if (postsData.data && postsData.data.length > 0) {
            console.log(`   First post ID: ${postsData.data[0].id}`);
            console.log(`   First post created: ${postsData.data[0].created_time}`);
        }
        
        if (postsData.paging) {
            console.log(`   Has more pages: ${!!postsData.paging.next}`);
        }
    }
} catch (error) {
    console.error(`   ❌ Failed to fetch posts: ${error.message}`);
    console.error(`   Error name: ${error.name}`);
    console.error(`   Error cause:`, error.cause);
    
    if (error.message.includes("fetch failed")) {
        console.error("\n   ⚠️  Network-level failure detected!");
        console.error("   This usually means:");
        console.error("     1. No internet connection");
        console.error("     2. DNS can't resolve graph.facebook.com");
        console.error("     3. Firewall/proxy blocking the connection");
        console.error("     4. SSL certificate issues");
        console.error("\n   Try running: ping graph.facebook.com");
        console.error("   Or: curl -v https://graph.facebook.com/");
    }
}

console.log("\n=== Debug Complete ===");
