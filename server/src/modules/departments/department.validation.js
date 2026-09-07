const { z } = require("zod");

const createDepartmentSchema = z.object({
    branchId: z
        .string()
        .trim()
        .min(1, "Branch ID is required"),

    name: z
        .string()
        .trim()
        .min(1, "Department name is required"),

    code: z
        .string()
        .trim()
        .min(1, "Department code is required"),

    type: z
        .string()
        .trim()
        .optional(),

    status: z
        .enum(["active", "inactive"])
        .optional(),
});

module.exports = {
    createDepartmentSchema,
};