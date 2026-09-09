const { z } = require("zod");

const updateMyProfileSchema = z
    .object({
        firstName: z
            .string()
            .trim()
            .min(1, "First name is required")
            .optional(),

        middleName: z
            .string()
            .trim()
            .optional(),

        lastName: z
            .string()
            .trim()
            .min(1, "Last name is required")
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
                "Invalid secondary phone number"
            )
            .optional(),

        address: z
            .object({
                street: z.string().trim().optional(),
                city: z.string().trim().optional(),
                state: z.string().trim().optional(),
                zipCode: z
                    .string()
                    .regex(
                        /^\d{6}$/,
                        "Invalid ZIP code"
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