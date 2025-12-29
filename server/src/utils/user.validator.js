import * as z from "zod";

const signUpValidator = z
    .object({
        fullName: z.string({ error: "Please enter a valid full name." }).trim(),

        email: z
            .string()
            .trim()
            .regex(
                /^(?!\s*$)(?!.*\s)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                { message: "Please enter a valid email address." }
            )
            .min(1, { error: "Please enter your email address." }),

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
                message:
                    "Password must include at least one special character.",
            })

            .regex(/^(?=.*\d)/, {
                error: "Password must include at least one number.",
            }),

        confirmPassword: z
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
                message:
                    "Password must include at least one special character.",
            })
            .regex(/^(?=.*\d)/, {
                error: "Password must include at least one number.",
            }),
    })
    .refine(({ password, confirmPassword }) => password !== confirmPassword, {
        error: "Password do not match",
        path: ["confirmPassword"],
    });

const loginValidator = z.object({
    email: z
        .email({
            error: "Please enter a valid email address.",
        })
        .trim()
        .min(1, { error: "Please enter your email address." }),

    password: z.string().trim(),

    isRemember: z.boolean().default(false),
});

const postValidator = z.object({
    title: z.string().trim().min(3, {
        error: "Title must contain at least 3 characters.",
    }),

    description: z.string().trim().min(10, {
        error: "Description must contain at least 10 characters.",
    }),
});

export { signUpValidator, loginValidator };
