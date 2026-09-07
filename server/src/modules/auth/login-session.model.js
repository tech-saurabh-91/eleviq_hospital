const mongoose = require("mongoose");

const loginSessionSchema = new mongoose.Schema(
    {
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
        },

        accountType: {
            type: String,
            enum: ["user", "patient"],
            required: true,
        },

        ipAddress: {
            type: String,
            required: true,
        },

        userAgent: {
            type: String,
            default: null,
        },

        deviceInfo: {
            type: String,
            default: null,
        },

        loginAt: {
            type: Date,
            default: Date.now,
        },

        logoutAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const LoginSession = mongoose.model(
    "LoginSession",
    loginSessionSchema
);

module.exports = LoginSession;