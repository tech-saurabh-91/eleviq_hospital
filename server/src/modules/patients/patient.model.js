const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        patientId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        mobile: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        passwordHash: {
            type: String,
            required: true,
        },

        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role",
            },
        ],

        isVerified: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: ["active", "inactive", "pending"],
            default: "active",
        },

        registrationType: {
            type: String,
            enum: ["self", "guardian"],
            required: true,
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

        dateOfBirth: {
            type: String,
            required: true,
            match: /^\d{4}-\d{2}-\d{2}$/,
        },

        gender: {
            type: String,
            required: true,
            trim: true,
        },

        primaryPhone: {
            type: String,
            required: true,
            trim: true,
        },

        secondaryPhone: {
            type: String,
            trim: true,
        },

        bloodType: {
            type: String,
            enum: [
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-",
                "unknown",
            ],
            default: "unknown",
        },

        allergies: {
            type: [String],
            default: [],
        },

        address: {
            street: {
                type: String,
                trim: true,
            },

            city: {
                type: String,
                trim: true,
            },

            state: {
                type: String,
                trim: true,
            },

            zipCode: {
                type: String,
                trim: true,
            },
        },

        registrationStatus: {
            type: String,
            enum: ["pending", "active"],
            default: "pending",
        },

        emailVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;