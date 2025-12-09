import express from "express";

const app = express();

const PORT = process.env.PORT;

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;

// Redirecting user to the linkedin login
app.get("/auth/linkedin", (req, res) => {
    const authUrl =
        "https://www.linkedin.com/oauth/v2/authorization" +
        `?response_type=code` +
        `&client_id=${CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&scope=w_member_social%20r_liteprofile`;

    res.redirect(authUrl);
});

app.listen(PORT, (req, res) => {
    console.log(`Server running on http://localhost:${PORT}`);
});
