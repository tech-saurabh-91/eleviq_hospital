const { z } = require("zod");

const nameSchema = z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(50, "Must be 50 characters or less")
    .regex(/^[A-Za-zÀ-ÿ\u0900-\u097F\s.'-]+$/, "Contains invalid characters");

const locationNameSchema = z
    .string()
    .trim()
    .min(2, "This field is required")
    .max(100, "Must be 100 characters or less")
    .regex(/^[A-Za-zÀ-ÿ\u0900-\u097F][A-Za-zÀ-ÿ\u0900-\u097F .'-]*$/, "Contains invalid characters");

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
            .min(1, "Street address is required")
            .max(200, "Street address must be 200 characters or less"),

        city: locationNameSchema,

        state: locationNameSchema,

        zipCode: z
            .string()
            .trim()
            .regex(/^[1-9]\d{5}$/, "PIN code must contain 6 digits and cannot start with 0"),
    })
    .strict();

const dateOfBirthSchema = z
    .string()
    .trim()
    .regex(
        /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        "Date of birth must be DD/MM/YYYY"
    )
    .refine((value) => {
        const [day, month, year] = value.split("/").map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));

        return date.getUTCFullYear() === year &&
            date.getUTCMonth() === month - 1 &&
            date.getUTCDate() === day;
    }, "Date of birth must be a real calendar date")
    .refine((value) => {
        const [day, month, year] = value.split("/").map(Number);
        const date = Date.UTC(year, month - 1, day);
        const now = new Date();
        const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

        return date <= today;
    }, "Date of birth cannot be in the future");

const createFamilyMemberSchema = z
    .object({
        firstName: nameSchema,

        middleName: z
            .string()
            .trim()
            .max(50, "Middle name must be 50 characters or less")
            .regex(/^[A-Za-zÀ-ÿ\u0900-\u097F\s.'-]*$/, "Middle name contains invalid characters")
            .optional(),

        lastName: nameSchema,

        relationship: relationshipSchema,

        dateOfBirth: dateOfBirthSchema,

        gender: z.enum(["male", "female", "other"]),

        insuranceCoverage: z
            .enum(["patient", "own"])
            .default("patient"),

        // Client may optionally pass or omit these; backend will populate them from the authenticated patient
        address: addressSchema.optional(),

        email: z
            .string()
            .trim()
            .toLowerCase()
            .email("Invalid email address")
            .optional(),

        phone: z
            .string()
            .trim()
            .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
            .optional(),
    });

const updateFamilyMemberSchema = z
    .object({
        firstName: nameSchema.optional(),

        middleName: z
            .string()
            .trim()
            .max(50)
            .regex(/^[A-Za-zÀ-ÿ\u0900-\u097F\s.'-]*$/)
            .optional(),

        lastName: nameSchema.optional(),

        relationship: relationshipSchema.optional(),

        dateOfBirth: dateOfBirthSchema.optional(),

        gender: z.enum(["male", "female", "other"]).optional(),

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
            .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
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
