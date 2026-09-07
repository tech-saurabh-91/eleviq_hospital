const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        code:{
            type: String,
            required: true,
            trim: true,
            unique: true,
            uppercase: true,
        },

        address:{
            type: String,
            trim: true,
        },

        contact:{
            type: String,
            trim: true,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
        },

        baseCurrency:{
            type: String,
            trim: true,
            default:"INR",
        },

        status:{
            type:String,
            enum:["active","inactive"],
            default:"active",
        },
    },
    {
        timestamps: true,
    }
);

const Company = mongoose.model("Company",companySchema);

module.exports=Company;