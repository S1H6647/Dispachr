export const validatePlatform = async (request, response, next) => {
    try {
        const { platforms } = request.body;
        if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
            return response.status(400).json({
                success: false,
                message: "Please select at least one platform.",
            });
        }
        next();
    } catch (error) {
        return response.status(401).json({ message: "Invalid Platform" });
    }
};
