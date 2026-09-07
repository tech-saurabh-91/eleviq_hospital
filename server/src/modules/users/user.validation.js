const { z } = require("zod");

const createUserSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1,"Username is required"),

        mobile: z
            .string()
            .trim()
            .min(1,"Mobile number is required"),

        password: z
            .string()
            .min(8,"Password must be at least 8 characters"),
        
        role: z
            .string()
            .trim()
            .min(1,"Role is required"),
});

module.exports = { createUserSchema, };