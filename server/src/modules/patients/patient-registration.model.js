const mongoose = require("mongoose");

const patientRegistrationSchema = new mongoose.Schema(
    {
        registrationStatus: {
            type: String,
            enum: [
                "in_progress",
                "pending_verification",
                "completed",
                "expired",
            ],
            default: "in_progress",
        },

        // Terms & Conditions
        terms: {
            termsId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Terms",
            },

            termsVersion: {
                type: String,
                trim: true,
            },

            accepted: {
                type: Boolean,
                default: false,
            },

            acceptedAt: {
                type: Date,
            },
        },

        // Prerequisites
        prerequisites: {
            completed: {
                type: Boolean,
                default: false,
            },

            completedAt: {
                type: Date,
            },
        },

        // Age Verification
        ageVerification: {
            selection: {
                type: String,
                enum: [
                    "adult",
                    "guardian",
                ],
                default: null,
            },

            completed: {
                type: Boolean,
                default: false,
            },

            completedAt: {
                type: Date,
            },
        },

        // Registration path
        registrationType: {
            type: String,
            enum: [
                "self",
                "guardian",
            ],
        },

        // Account information will be added
        // as the registration progresses.
        account: {
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

            username: {
                type: String,
                trim: true,
                lowercase: true,
            },

            email: {
                type: String,
                trim: true,
                lowercase: true,
            },

            passwordHash: {
                type: String,
            },

            firstName: {
                type: String,
                trim: true,
            },

            middleName: {
                type: String,
                trim: true,
            },

            lastName: {
                type: String,
                trim: true,
            },

            dateOfBirth: {
                type: String,
                match: /^\d{4}-\d{2}-\d{2}$/,
            },

            gender: {
                type: String,
                trim: true,
            },

            primaryPhone: {
                type: String,
                trim: true,
            },

            secondaryPhone: {
                type: String,
                trim: true,
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

            confirmationAccepted: {
                type: Boolean,
                default: false,
            },
        },

        // Verification
        verification: {
            method: {
                type: String,
                enum: [
                    "email",
                    "sms",
                ],
            },

            emailVerified: {
                type: Boolean,
                default: false,
            },

            verifiedAt: {
                type: Date,
            },
        },
    },
    {
        timestamps: true,
    }
);

const PatientRegistration = mongoose.model(
    "PatientRegistration",
    patientRegistrationSchema
);

module.exports = PatientRegistration;