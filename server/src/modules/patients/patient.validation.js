const { z } = require("zod");

const completePrerequisitesSchema = z.object({
    registrationId: z
        .string()
        .trim()
        .min(1, "Registration ID is required"),
});

const completeAgeVerificationSchema = z.object({
    registrationId: z
        .string()
        .trim()
        .min(1, "Registration ID is required"),

    selection: z.enum(
        ["adult", "guardian"],
        {
            message:
                "Age verification selection is required",
        }
    ),
});

const registerPatientSchema = z.object({

    termsId: z
        .string()
        .trim()
        .min(1, "Terms ID is required"),

    termsAccepted: z
        .boolean()
        .refine(
            (value) => value === true,
            {
                message: "You must accept the Terms & Conditions",
            }
        ),

    termsAcceptedAt: z
        .string()
        .datetime("Invalid Terms acceptance date"),

    registrationType: z.enum(["self", "guardian"]),

    profilePicture: z
        .string()
        .trim()
        .optional(),

    email: z
        .string()
        .trim()
        .email("Invalid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[0-9]/, "Password must contain a number")
        .regex(
            /[^A-Za-z0-9]/,
            "Password must contain a special character"
        ),

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

    dateOfBirth: z
        .string()
        .trim()
        .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Date of birth must be in YYYY-MM-DD format"),

    gender: z
        .string()
        .trim()
        .min(1, "Gender is required"),

    primaryPhone: z
        .string()
        .trim()
        .min(1, "Primary phone number is required"),

    secondaryPhone: z
        .string()
        .trim()
        .optional(),

    address: z.object({
        street: z.string().trim().optional(),
        city: z.string().trim().optional(),
        state: z.string().trim().optional(),
        zipCode: z.string().trim().optional(),
    }),

    confirmationAccepted: z
        .boolean()
        .refine(
            (value) => value === true,
            {
                message:
                    "You must confirm that all entered information is correct",
            }
        ),
});

const verifyRegistrationOtpSchema = z.object({
    registrationId: z
        .string()
        .trim()
        .min(1, "Registration ID is required"),

    otp: z
        .string()
        .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

const createRegistrationSessionSchema = z.object({
    termsId: z
        .string()
        .trim()
        .min(1, "Terms ID is required"),

    termsAccepted: z
        .boolean()
        .refine(
            (value) => value === true,
            {
                message:
                    "You must accept the Terms & Conditions",
            }
        ),
});

const accountInformationSchema = z.object({
    registrationId: z
        .string()
        .trim()
        .min(1, "Registration ID is required"),

    registrationType: z.enum([
        "self",
        "guardian",
    ]),

    profilePicture: z
        .string()
        .trim()
        .optional(),

    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must not exceed 30 characters")
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "Username can contain only letters, numbers, and underscores"
        ),

    email: z
        .string()
        .trim()
        .email("Invalid email address"),

    password: z
        .string()
        .min(
            8,
            "Password must be at least 8 characters"
        )
        .regex(
            /[A-Z]/,
            "Password must contain an uppercase letter"
        )
        .regex(
            /[0-9]/,
            "Password must contain a number"
        )
        .regex(
            /[^A-Za-z0-9]/,
            "Password must contain a special character"
        ),

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

    dateOfBirth: z
        .string()
        .trim()
        .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Date of birth must be in YYYY-MM-DD format"),

    gender: z
        .string()
        .trim()
        .min(1, "Gender is required"),

    primaryPhone: z
        .string()
        .regex(
            /^[6-9]\d{9}$/,
            "Invalid primary phone number"
        ),

    secondaryPhone: z
        .string()
        .optional(),

    address: z.object({
        street: z.string().trim().min(1),
        city: z.string().trim().min(1),
        state: z.string().trim().min(1),
        zipCode: z
            .string()
            .regex(
                /^\d{6}$/,
                "Invalid PIN code"
            ),
    }),

    confirmationAccepted: z
        .boolean()
        .refine(
            (value) => value === true,
            {
                message:
                    "You must confirm that the information is correct",
            }
        ),
});

const completeVerificationMethodSchema = z.object({
    registrationId: z
        .string()
        .trim()
        .min(1, "Registration ID is required"),

    method: z.enum(
        ["email"],
        {
            message: "Email verification is currently supported",
        }
    ),
});

const resendRegistrationOtpSchema = z.object({
    registrationId: z
        .string()
        .trim()
        .min(1, "Registration ID is required"),
});

module.exports = {
    createRegistrationSessionSchema,
    completePrerequisitesSchema,
    completeAgeVerificationSchema,
    accountInformationSchema,
    completeVerificationMethodSchema,
    registerPatientSchema,
    verifyRegistrationOtpSchema,
    resendRegistrationOtpSchema,
};