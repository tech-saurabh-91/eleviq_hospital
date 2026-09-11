const { z } = require("zod");

const createInsuranceSchema = z.object({

    insuranceType: z
        .string()
        .trim()
        .min(1, "Insurance type is required"),

    insuranceProvider: z
        .string()
        .trim()
        .min(1, "Insurance provider is required"),

    insuranceId: z
        .string()
        .trim()
        .min(1, "Insurance ID is required"),

    policyNumber: z
        .string()
        .trim()
        .min(1, "Policy number is required"),

    groupNumber: z
        .string()
        .trim()
        .optional(),

    ediPayer: z
        .string()
        .trim()
        .optional(),

    coverageType: z
        .string()
        .trim()
        .min(1, "Coverage type is required"),

    effectiveDate: z
        .string()
        .trim()
        .min(1, "Effective date is required"),

    relationship: z
        .string()
        .trim()
        .min(1, "Relationship is required"),

    familyMemberId: z
        .string()
        .trim()
        .optional(),

    isPrimary: z.preprocess(
        (value) => {
            if (value === "true") return true;
            if (value === "false") return false;
            return value;
        },
        z.boolean().default(false)
    ),

    subscriberName: z
        .string()
        .trim()
        .optional(),

    subscriberCopay: z
        .string()
        .trim()
        .optional(),

    subscriberSsn: z
        .string()
        .trim()
        .optional(),

    subscriberDateOfBirth: z
        .string()
        .trim()
        .optional(),

    subscriberAddress: z
        .string()
        .trim()
        .optional(),

    frontCardImage: z
        .string()
        .trim()
        .optional(),

    backCardImage: z
        .string()
        .trim()
        .optional(),
});

const updateInsuranceSchema = z.object({
    insuranceType: z.string().trim().min(1).optional(),
    insuranceProvider: z.string().trim().min(1).optional(),
    insuranceId: z.string().trim().min(1).optional(),
    policyNumber: z.string().trim().min(1).optional(),
    groupNumber: z.string().trim().optional(),
    ediPayer: z.string().trim().optional(),
    coverageType: z.string().trim().min(1).optional(),
    effectiveDate: z.string().trim().min(1).optional(),
    relationship: z.string().trim().min(1).optional(),

    familyMemberId: z.string().trim().optional(),

    isPrimary: z.preprocess(
        (value) => {
            if (value === "true") return true;
            if (value === "false") return false;
            return value;
        },
        z.boolean().optional()
    ),

    subscriberName: z.string().trim().optional(),
    subscriberCopay: z.string().trim().optional(),
    subscriberSsn: z.string().trim().optional(),
    subscriberDateOfBirth: z.string().trim().optional(),
    subscriberAddress: z.string().trim().optional(),
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required",
    }
);

module.exports = {
    createInsuranceSchema,
    updateInsuranceSchema,
};