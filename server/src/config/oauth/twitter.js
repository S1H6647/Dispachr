import "dotenv/config";

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const ACCESS_SECRET = process.env.ACCESS_SECRET;

const OAUTH_CLIEND_ID = process.env.OAUTH_CLIEND_ID;
const OAUTH_CLIEND_SECRET = process.env.OAUTH_CLIEND_SECRET;

const url = "https://api.x.com/2/tweets";
const options = {
    method: "POST",
    headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
    },
    body: '{"card_uri":"<string>","community_id":"1146654567674912769","direct_message_deep_link":"<string>","edit_options":{"previous_post_id":"1346889436626259968"},"for_super_followers_only":false,"geo":{"place_id":"<string>"},"media":{"media_ids":["1146654567674912769"],"tagged_user_ids":["2244994945"]},"nullcast":false,"poll":{"duration_minutes":5042,"options":["<string>"],"reply_settings":"following"},"quote_tweet_id":"1346889436626259968","reply":{"exclude_reply_user_ids":["2244994945"],"in_reply_to_tweet_id":"1346889436626259968"},"reply_settings":"following","share_with_followers":false,"text":"Learn how to use the user Tweet timeline and user mention timeline endpoints in the X API v2 to explore Tweet\\u2026 https:\\/\\/t.co\\/56a0vZUx7i"}',
};

try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
} catch (error) {
    console.error(error);
}
