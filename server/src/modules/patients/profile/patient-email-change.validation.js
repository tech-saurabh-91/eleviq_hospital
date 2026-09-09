const { z } = require("zod");

const requestEmailChangeSchema = z
    .object({
        newEmail: z
            .string()
            .email("Invalid email address")
            .trim()
            .toLowerCase(),
    })
    .strict();

const verifyEmailChangeSchema = z
    .object({
        otp: z
            .string()
            .regex(/^\d{6}$/, "OTP must be 6 digits"),
    })
    .strict();

module.exports = {
    requestEmailChangeSchema,
    verifyEmailChangeSchema,
};