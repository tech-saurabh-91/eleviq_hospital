const mongoose = require("mongoose");

const appointmentSettingsSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            default: "default",
        },
        
        appointmentDuration: {
            type: Number,
            required: true,
            min: 5,
            default: 15,
        },

        morningSchedule: {
            startTime: {
                type: String,
                required: true,
                default: "09:00",
            },
            endTime: {
                type: String,
                required: true,
                default: "13:00",
            },
        },

        eveningSchedule: {
            startTime: {
                type: String,
                required: true,
                default: "17:00",
            },
            endTime: {
                type: String,
                required: true,
                default: "22:00",
            },
        },

        payment: {
            enabled: {
                type: Boolean,
                default: false,
            },

            appointmentFee: {
                type: Number,
                min: 0,
                default: 0,
            },
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "AppointmentSettings",
    appointmentSettingsSchema
);