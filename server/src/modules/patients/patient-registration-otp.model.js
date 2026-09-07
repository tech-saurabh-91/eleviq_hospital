const mongoose = require("mongoose");

const patientRegistrationOtpSchema = new mongoose.Schema(
    {
        registrationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PatientRegistration",
            required: true,
            unique: true,
            index: true,
        },

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

        expiresAt: {
            type: Date,
            required: true,
        },

        attempts: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

patientRegistrationOtpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

const PatientRegistrationOtp = mongoose.model(
    "PatientRegistrationOtp",
    patientRegistrationOtpSchema
);

module.exports = PatientRegistrationOtp;