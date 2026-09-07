const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            trim: true,
            unique: true,
            sparse: true,
        },

        email:{
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            sparse: true,
        },

        mobile:{
            type:String,
            required: true,
            trim: true,
            unique:true,
            sparse: true,
        },

        passwordHash:{
            type:String,
            required: true,
        },

        roles:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Role",
            }
        ],

        isVerified:{
            type:Boolean,
            default:false,
        },

        status:{
            type: String,
            enum: ["active","inactive","pending"],
            default:"active",
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User",userSchema);

module.exports = User;