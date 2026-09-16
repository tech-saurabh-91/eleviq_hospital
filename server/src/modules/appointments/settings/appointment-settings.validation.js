const { z } = require("zod");

const timeSchema = z.string()
    .trim()
    .regex(
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "Time must be in HH:mm format"
    );

const scheduleSchema = z.object({
    startTime: timeSchema,
    endTime: timeSchema,
}).strict();

const appointmentSettingsSchema = z.object({
    appointmentDuration: z.number()
        .int("Appointment duration must be a whole number")
        .min(5, "Appointment duration must be at least 5 minutes")
        .max(240, "Appointment duration cannot exceed 240 minutes")
        .optional(),

    morningSchedule: scheduleSchema.optional(),

    eveningSchedule: scheduleSchema.optional(),

    payment: z.object({
        enabled: z.boolean(),
        appointmentFee: z.number()
            .min(0, "Appointment fee cannot be negative"),
    }).strict().optional(),

    status: z.enum([
        "active",
        "inactive",
    ]).optional(),
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required",
    }
);

module.exports = {
    appointmentSettingsSchema,
};