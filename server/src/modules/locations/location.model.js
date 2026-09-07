const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
    {
        stateCode: {
            type: Number,
            required: true,
            index: true,
        },

        stateName: {
            type: String,
            required: true,
            trim: true,
        },

        localBodyCode: {
            type: Number,
            required: true,
            index: true,
        },

        localBodyName: {
            type: String,
            required: true,
            trim: true,
        },

        localBodyType: {
            type: String,
            required: true,
            trim: true,
        },

        pincode: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

locationSchema.index(
    {
        localBodyCode: 1,
        pincode: 1,
    },
    {
        unique: true,
    }
);

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;