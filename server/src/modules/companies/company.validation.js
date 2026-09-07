const { z } = require("zod");

const createCompanySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1,"Company name is required"),

    code: z
        .string()
        .trim()
        .min(1,"Company code is required"),

    address: z
        .string()
        .trim()
        .optional(),

    contact: z
        .string()
        .trim()
        .optional(),

    email: z
        .string()
        .trim()
        .email("Invalid email")
        .optional(),

    baseCurrency: z
        .string()
        .trim()
        .optional(),

    status: z
        .enum(["active", "inactive"])
        .optional(),
});

module.exports = { createCompanySchema};