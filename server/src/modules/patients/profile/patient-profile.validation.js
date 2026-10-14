const { z } = require("zod");

const updateMyProfileSchema = z
    .object({
        firstName: z
            .string()
            .trim()
            .min(1, "First name is required")
            .max(50, "First name must not exceed 50 characters")
            .regex(/^[A-Za-zÀ-ÿ\s'-]+$/, "First name contains invalid characters")
            .optional(),

        middleName: z
            .string()
            .trim()
            .max(50, "Middle name must not exceed 50 characters")
            .regex(/^[A-Za-zÀ-ÿ\s'-]*$/, "Middle name contains invalid characters")
            .optional(),

        lastName: z
            .string()
            .trim()
            .min(1, "Last name is required")
            .max(50, "Last name must not exceed 50 characters")
            .regex(/^[A-Za-zÀ-ÿ\s'-]+$/, "Last name contains invalid characters")
            .optional(),

        dateOfBirth: z
            .string()
            .regex(
                /^\d{4}-\d{2}-\d{2}$/,
                "Date of birth must be in YYYY-MM-DD format"
            )
            .optional(),

        gender: z
            .string()
            .trim()
            .min(1, "Gender is required")
            .optional(),

        secondaryPhone: z
            .string()
            .regex(
                /^[6-9]\d{9}$/,
                "Secondary phone must be a valid 10-digit Indian mobile number"
            )
            .optional(),

        address: z
            .object({
                street: z.string().trim().optional(),
                city: z.string().trim().max(100).optional(),
                state: z.string().trim().max(100).optional(),
                zipCode: z
                    .string()
                    .regex(
                        /^[1-9]\d{5}$/,
                        "PIN code must contain 6 digits and cannot start with 0"
                    )
                    .optional(),
            })
            .optional(),

        bloodType: z
            .enum([
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-",
                "unknown",
            ])
            .optional(),

        allergies: z
            .array(z.string().trim().min(1))
            .optional(),
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one profile field is required",
        }
    );

module.exports = {
    updateMyProfileSchema,
};