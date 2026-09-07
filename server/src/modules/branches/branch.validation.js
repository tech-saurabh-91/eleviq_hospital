const { z } = require("zod");

const createBranchSchema = z.object({
    companyId: z
        .string()
        .trim()
        .min(1, "Company ID is required"),

    name: z
        .string()
        .trim()
        .min(1, "Branch name is required"),

    code: z
        .string()
        .trim()
        .min(1, "Branch code is required"),

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

    status: z
        .enum(["active", "inactive"])
        .optional(),
});

module.exports = {
    createBranchSchema,
};