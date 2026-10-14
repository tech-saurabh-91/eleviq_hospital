const { z } = require("zod");

const createUserSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1, "Username is required")
        .max(50, "Username must not exceed 50 characters"),

    mobile: z
        .string()
        .trim()
        .regex(/^[6-9]\d{9}$/, "Mobile number must be a valid 10-digit Indian mobile number"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),

    role: z
        .string()
        .trim()
        .min(1, "Role is required"),
});

module.exports = { createUserSchema };