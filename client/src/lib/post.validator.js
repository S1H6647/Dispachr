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

export const passwordValidator = z.object({
    password: z
        .string()
        .trim()
        .min(8, { error: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[a-z])/, {
            error: "Password must include at least one lowercase letter.",
        })
        .regex(/^(?=.*[A-Z])/, {
            error: "Password must include at least one uppercase letter.",
        })
        .regex(/^(?=.*[!@#$%^&()_\-+=<>?{}[\]~])/, {
            message: "Password must include at least one special character.",
        })
        .regex(/^(?=.*\d)/, {
            error: "Password must include at least one number.",
        }),
});

export const helpValidator = z.object({
    email: z.string().trim().email("Please enter a valid email address."),
    contact: z
        .string()
        .trim()
        .min(10, "Contact number must be at least 10 characters."),
    description: z
        .string()
        .trim()
        .min(20, "Please provide at least 20 characters describing your issue.")
        .max(500, "Description cannot exceed 500 characters."),
});
