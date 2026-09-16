const { z } = require("zod");

const appointmentTypeSchema = z.enum([
    "SCHEDULED",
    "EMERGENCY",
]);

const appointmentDateSchema = z.string()
    .trim()
    .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Appointment date must be in YYYY-MM-DD format"
    );

const timeSchema = z.string()
    .trim()
    .regex(
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "Time must be in HH:mm format"
    );

const createAppointmentSchema = z.object({
    familyMemberId: z.string()
        .trim()
        .optional(),

    doctorId: z.string()
        .trim()
        .min(1, "Doctor is required"),

    appointmentType: appointmentTypeSchema,

    appointmentDate: appointmentDateSchema,

    startTime: timeSchema,

    visitReason: z.string()
        .trim()
        .min(1, "Visit reason is required")
        .max(500, "Visit reason cannot exceed 500 characters"),

    paymentMethod: z.enum([
        "ONLINE",
        "INSURANCE",
    ]).optional(),
}).strict();

const updateAppointmentSchema = z.object({
    appointmentDate: appointmentDateSchema.optional(),

    startTime: timeSchema.optional(),

    visitReason: z.string()
        .trim()
        .min(1, "Visit reason is required")
        .max(500, "Visit reason cannot exceed 500 characters")
        .optional(),

    paymentMethod: z.enum([
        "ONLINE",
        "INSURANCE",
    ]).optional(),
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required",
    }
);

const rescheduleAppointmentSchema = z
  .object({
    appointmentDate: appointmentDateSchema,
    startTime: timeSchema,
  })
  .strict();

module.exports = {
  createAppointmentSchema,
  updateAppointmentSchema,
  rescheduleAppointmentSchema,
};