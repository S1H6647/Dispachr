import { z } from "zod";

export const postValidator = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must contain at least 3 characters."),
    description: z
        .string()
        .trim()
        .min(10, "Description must contain at least 10 characters."),
    platforms: z.array(z.string()).min(1, "Select at least one platform."),
});
