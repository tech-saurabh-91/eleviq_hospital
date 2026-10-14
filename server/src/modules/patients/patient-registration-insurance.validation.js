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

    // Indian HMS Insurance Fields (Optional during registration)
    tpa: z.string().trim().optional(),
    planName: z.string().trim().optional(),
    policyType: z.string().trim().optional(),
    policyHolderName: z.string().trim().optional(),
    expiryDate: z.string().trim().optional(),
    sumInsured: z.preprocess((val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        const num = Number(val);
        return isNaN(num) ? undefined : num;
    }, z.number().nonnegative().optional()),
    roomRentLimit: z.string().trim().optional(),
    copay: z.string().trim().optional(),
    deductible: z.string().trim().optional(),
    coverageRestrictions: z.string().trim().optional(),
    employerName: z.string().trim().optional(),
    employeeId: z.string().trim().optional(),
    schemeName: z.string().trim().optional(),
    beneficiaryId: z.string().trim().optional(),
});

module.exports = {
    createRegistrationInsuranceSchema,
};