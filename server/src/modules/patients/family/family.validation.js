const { z } = require("zod");

const relationshipSchema = z.enum([
    "father",
    "mother",
    "son",
    "daughter",
    "husband",
    "wife",
    "brother",
    "sister",
    "grandfather",
    "grandmother",
    "grandson",
    "granddaughter",
    "guardian",
    "other",
]);

const addressSchema = z
    .object({
        street: z
            .string()
            .trim()
            .min(1, "Street address is required"),

        city: z
            .string()
            .trim()
            .min(1, "City is required"),

        state: z
            .string()
            .trim()
            .min(1, "State is required"),

        zipCode: z
            .string()
            .trim()
            .min(1, "ZIP code is required"),
    })
    .strict();

const dateOfBirthSchema = z
    .string()
    .trim()
    .regex(
        /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/,
        "Date of birth must be MM/DD/YYYY"
    );

const createFamilyMemberSchema = z
    .object({
        firstName: z
            .string()
            .trim()
            .min(1, "First name is required"),

        middleName: z
            .string()
            .trim()
            .optional(),

        lastName: z
            .string()
            .trim()
            .min(1, "Last name is required"),

        relationship: relationshipSchema,

        dateOfBirth: dateOfBirthSchema,

        gender: z
            .string()
            .trim()
            .min(1, "Gender is required"),

        address: addressSchema,

        email: z
            .string()
            .trim()
            .toLowerCase()
            .email("Invalid email address"),

        phone: z
            .string()
            .trim()
            .min(1, "Phone number is required"),

        insuranceCoverage: z
            .enum(["patient", "own"])
            .default("patient"),
    })
    .strict();

const updateFamilyMemberSchema = z
    .object({
        firstName: z
            .string()
            .trim()
            .min(1)
            .optional(),

        middleName: z
            .string()
            .trim()
            .optional(),

        lastName: z
            .string()
            .trim()
            .min(1)
            .optional(),

        relationship: relationshipSchema,

        dateOfBirth: dateOfBirthSchema.optional(),

        gender: z
            .string()
            .trim()
            .min(1)
            .optional(),

        address: addressSchema.partial().optional(),

        email: z
            .string()
            .trim()
            .toLowerCase()
            .email("Invalid email address")
            .optional(),

        phone: z
            .string()
            .trim()
            .min(1)
            .optional(),

        insuranceCoverage: z
            .enum(["patient", "own"])
            .optional(),
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required",
        }
    );

module.exports = {
    createFamilyMemberSchema,
    updateFamilyMemberSchema,
};