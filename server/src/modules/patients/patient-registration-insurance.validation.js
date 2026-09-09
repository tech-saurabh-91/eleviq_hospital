const { z } = require("zod");

const createRegistrationInsuranceSchema = z.object({

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

    isPrimary: z.preprocess(
        (value) => {
            if (value === "true") return true;
            if (value === "false") return false;
            return value;
        },
        z.boolean().default(false)
    ),

    frontCardImage: z
        .string()
        .trim()
        .optional(),

    backCardImage: z
        .string()
        .trim()
        .optional(),
});

module.exports = {
    createRegistrationInsuranceSchema,
};