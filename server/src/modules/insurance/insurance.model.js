const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },

        insuranceType: {
            type: String,
            required: true,
            trim: true,
        },

        insuranceProvider: {
            type: String,
            required: true,
            trim: true,
        },

        insuranceId: {
            type: String,
            required: true,
            trim: true,
        },

        policyNumber: {
            type: String,
            required: true,
            trim: true,
        },

        groupNumber: {
            type: String,
            trim: true,
        },

        ediPayer: {
            type: String,
            trim: true,
        },

        coverageType: {
            type: String,
            required: true,
            trim: true,
        },

        effectiveDate: {
            type: Date,
            required: true,
        },

        isPrimary: {
            type: Boolean,
            default: false,
        },

        frontCardImage: {
            type: String,
            trim: true,
        },

        backCardImage: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Insurance = mongoose.model(
    "Insurance",
    insuranceSchema
);

module.exports = Insurance;