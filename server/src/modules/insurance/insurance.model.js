const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
    {
        // Patient account that owns/manages this insurance record
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
            index: true,
        },

        // Null for patient's own insurance.
        // Set for insurance covering a family member.
        familyMember: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FamilyMember",
            default: null,
            index: true,
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

        relationship: {
            type: String,
            required: true,
            trim: true,
        },

        isPrimary: {
            type: Boolean,
            default: false,
        },

        // Commercial insurance subscriber information
        subscriberName: {
            type: String,
            trim: true,
        },

        subscriberCopay: {
            type: String,
            trim: true,
        },

        subscriberSsn: {
            type: String,
            trim: true,
        },

        subscriberDateOfBirth: {
            type: Date,
        },

        subscriberAddress: {
            type: String,
            trim: true,
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

insuranceSchema.index({
    patient: 1,
    familyMember: 1,
});

module.exports = mongoose.model("Insurance", insuranceSchema);