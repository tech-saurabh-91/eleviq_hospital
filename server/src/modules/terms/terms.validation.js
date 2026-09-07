const { z } = require("zod");

const createTermsSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1,"Title is required"),

    content: z
        .string()
        .trim()
        .min(1,"Content is required"),
    
    version: z
        .string()
        .trim()
        .min(1,"Version is required"),
    
    status: z
        .enum(["active","inactive"])
        .optional(),
            
});

const updateTermsSchema = createTermsSchema.partial();

module.exports = {
    createTermsSchema,
    updateTermsSchema,
};