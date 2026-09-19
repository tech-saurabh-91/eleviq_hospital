const { z } = require("zod");

const dateSchema = z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

const medicineSchema = z.object({
    medicineName: z
        .string()
        .trim()
        .min(1, "Medicine name is required")
        .max(200),

    strength: z.string().trim().max(100).optional(),

    route: z.string().trim().max(100).optional(),

    frequency: z.string().trim().max(100).optional(),

    duration: z.string().trim().max(100).optional(),

    quantity: z
        .number()
        .min(0)
        .optional(),

    instructions: z.string().trim().max(500).optional(),
}).strict();

const investigationSchema = z.object({
    testName: z
        .string()
        .trim()
        .min(1, "Test name is required")
        .max(200),

    instructions: z.string().trim().max(500).optional(),
}).strict();

const followUpSchema = z.object({
    date: dateSchema.optional(),

    instructions: z.string().trim().max(1000).optional(),
}).strict();

const createClinicalRecordSchema = z.object({
    appointmentId: z
        .string()
        .trim()
        .min(1, "Appointment ID is required"),

    presentingComplaints: z
        .string()
        .trim()
        .max(2000)
        .optional(),

    historyOfPresentIllness: z
        .string()
        .trim()
        .max(5000)
        .optional(),

    reviewOfSystems: z
        .string()
        .trim()
        .max(5000)
        .optional(),

    assessment: z
        .string()
        .trim()
        .max(5000)
        .optional(),

    plan: z
        .string()
        .trim()
        .max(5000)
        .optional(),

    medicines: z
        .array(medicineSchema)
        .optional(),

    investigations: z
        .array(investigationSchema)
        .optional(),

    followUp: followUpSchema.optional(),

    otherNotes: z
        .string()
        .trim()
        .max(3000)
        .optional(),
}).strict();

module.exports = {
    createClinicalRecordSchema,
};