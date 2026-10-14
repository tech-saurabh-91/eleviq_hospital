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
            publicId: {
                type: String,
                trim: true,
            },
            url: {
                type: String,
                trim: true,
            },
        },

        backCardImage: {
            publicId: {
                type: String,
                trim: true,
            },
            url: {
                type: String,
                trim: true,
            },
        },

        // Indian HMS Insurance Fields
        tpa: {
            type: String,
            trim: true,
        },

        planName: {
            type: String,
            trim: true,
        },

        policyType: {
            type: String,
            trim: true,
            default: "Individual",
        },

        policyHolderName: {
            type: String,
            trim: true,
        },

        expiryDate: {
            type: Date,
        },

        sumInsured: {
            type: Number,
            min: 0,
        },

        remainingSumInsured: {
            type: Number,
            min: 0,
        },

        roomRentLimit: {
            type: String,
            trim: true,
        },

        copay: {
            type: String,
            trim: true,
        },

        deductible: {
            type: String,
            trim: true,
        },

        coverageRestrictions: {
            type: String,
            trim: true,
        },

        // Group / Employer Insurance
        employerName: {
            type: String,
            trim: true,
        },

        employeeId: {
            type: String,
            trim: true,
        },

        // Government Schemes (e.g. AB PM-JAY, State Schemes)
        schemeName: {
            type: String,
            trim: true,
        },

        beneficiaryId: {
            type: String,
            trim: true,
        },

        // Policy Document / Schedule (PDF / Image)
        policyDocument: {
            publicId: {
                type: String,
                trim: true,
            },
            url: {
                type: String,
                trim: true,
            },
        },

        // Verification Workflow
        verificationStatus: {
            type: String,
            enum: ["Pending", "Verified", "Rejected", "Expired"],
            default: "Pending",
        },

        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        verificationDate: {
            type: Date,
            default: null,
        },

        verificationRemarks: {
            type: String,
            trim: true,
            default: "",
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