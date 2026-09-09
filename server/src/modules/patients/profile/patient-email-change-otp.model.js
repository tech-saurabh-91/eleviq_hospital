const mongoose = require("mongoose");

const patientEmailChangeOtpSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
            unique: true,
        },

        newEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
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

patientEmailChangeOtpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

module.exports = mongoose.model(
    "PatientEmailChangeOtp",
    patientEmailChangeOtpSchema
);