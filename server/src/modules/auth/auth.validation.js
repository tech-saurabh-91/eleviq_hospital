const {z} = require("zod");

const loginSchema = z.object({
    identifier: z
        .string()
        .trim()
        .min(1,"Username, mobile number or email is required"),
    
    password: z
        .string()
        .min(1,"Password is required"),
});

module.exports ={
    loginSchema,
}