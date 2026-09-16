const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        // The registered patient who is making the booking
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
            index: true,
        },

        // Null when appointment is for self
        // Set when appointment is for a family member
        familyMember: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FamilyMember",
            default: null,
            index: true,
        },

        // Doctor is an existing User with the doctor role
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        appointmentType: {
            type: String,
            enum: ["SCHEDULED", "EMERGENCY"],
            required: true,
        },

        // YYYY-MM-DD
        appointmentDate: {
            type: String,
            required: true,
            match: /^\d{4}-\d{2}-\d{2}$/,
            index: true,
        },

        // HH:mm
        startTime: {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):([0-5]\d)$/,
        },

        // HH:mm
        endTime: {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):([0-5]\d)$/,
        },

        visitReason: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },

        status: {
            type: String,
            enum: [
                "BOOKED",
                "VERIFIED",
                "CONFIRMED",
            ],
            default: "BOOKED",
            index: true,
        },

        rescheduledAt: {
            type: Date,
            default: null,
        },

        payment: {
            status: {
                type: String,
                enum: [
                    "NOT_REQUIRED",
                    "PENDING",
                    "PAID",
                    "FAILED",
                ],
                default: "NOT_REQUIRED",
            },

            method: {
                type: String,
                enum: [
                    "ONLINE",
                    "INSURANCE",
                ],
            },

            amount: {
                type: Number,
                min: 0,
                default: 0,
            },

            reference: {
                type: String,
                trim: true,
            },
        },

        verifiedAt: {
            type: Date,
        },

        confirmedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// One doctor cannot have two appointments
// in the same date and start-time slot.
appointmentSchema.index(
    {
        doctor: 1,
        appointmentDate: 1,
        startTime: 1,
    },
    {
        unique: true,
    }
);

module.exports = mongoose.model(
    "Appointment",
    appointmentSchema
);