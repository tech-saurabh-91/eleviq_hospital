const { z } = require("zod");

const createDesignationSchema = z.object({
    departmentId: z
        .string()
        .trim()
        .min(1, "Department ID is required"),

    name: z
        .string()
        .trim()
        .min(1, "Designation name is required"),

    code: z
        .string()
        .trim()
        .min(1, "Designation code is required"),

    status: z
        .enum(["active", "inactive"])
        .optional(),
});

module.exports = {
    createDesignationSchema,
};