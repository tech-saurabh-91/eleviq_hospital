const mongoose = require("mongoose");

const termsSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            trim: true,
        },

        content:{
            type: String,
            required: true,
            trim: true,
        },

        version:{
            type:String,
            required: true,
            trim: true,
        },

        status:{
            type: String,
            enum:["active","inactive"],
            default:"inactive",
        },

        publishedAt:{
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Terms = mongoose.model("Terms",termsSchema);

module.exports = Terms;