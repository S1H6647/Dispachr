export const createToken = (response, accessToken, isRemember) => {
    try {
        let maxAge = 10 * 60 * 1000; // 10 minutes

        if (isRemember) {
            maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        }

        response.cookie("auth-token", accessToken, {
            maxAge: maxAge,
            secure: true,
            httpOnly: true,
            path: "/",
            sameSite: "lax",
        });
    } catch (error) {
        throw new Error("Failed to create token");
    }
};
