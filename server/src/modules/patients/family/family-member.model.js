const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
            index: true,
        },

        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        middleName: {
            type: String,
            trim: true,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        relationship: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            enum: [
                "father",
                "mother",
                "son",
                "daughter",
                "husband",
                "wife",
                "brother",
                "sister",
                "grandfather",
                "grandmother",
                "grandson",
                "granddaughter",
                "guardian",
                "other",
            ],
        },

        dateOfBirth: {
            type: String,
            required: true,
            match: /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/,
        },

        gender: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        address: {
            street: {
                type: String,
                required: true,
                trim: true,
            },

            city: {
                type: String,
                required: true,
                trim: true,
            },

            state: {
                type: String,
                required: true,
                trim: true,
            },

            zipCode: {
                type: String,
                required: true,
                trim: true,
            },
        },

        profilePicture: {
            publicId: {
                type: String,
                trim: true,
            },

            url: {
                type: String,
                trim: true,
            },
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },

        insuranceCoverage: {
            type: String,
            enum: ["patient", "own"],
            default: "patient",
        },
    },
    {
        timestamps: true,
    }
);

familyMemberSchema.index({
    patient: 1,
    status: 1,
});

module.exports = mongoose.model(
    "FamilyMember",
    familyMemberSchema
);