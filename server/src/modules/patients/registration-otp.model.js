const mongoose = require("mongoose");

const registrationOtpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        otpHash: {
            type: String,
            required: true,
        },

        registrationData: {
            type: Object,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        attempts: {
            type: Number,
            default: 0,
        },

        verified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

registrationOtpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

const RegistrationOtp = mongoose.model(
    "RegistrationOtp",
    registrationOtpSchema
);

module.exports = RegistrationOtp;