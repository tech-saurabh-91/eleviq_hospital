const express = require("express");
const validate = require("../../middleware/validate");
const authenticate = require("../../middleware/auth");
const authorize = require("../../middleware/authorize");
const {loginSchema} = require("./auth.validation");

const { login, logout } = require("./auth.controller");
const { getMySessions } = require("./login-session.controller");

const router = express.Router();

router.get("/test/clinical",
    authenticate,
    authorize("clinical.read"),
    (req,res) =>{
        return res.status(200).json({
            success: true,
            message:"Clinical permission verified successfully",
        });
    }
);

router.get(
    "/test/inventory",
    authenticate,
    authorize("inventory.update"),
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Inventory permission verified successfully",
        });
    }
);

router.get(
    "/sessions",
    authenticate,
    getMySessions
);

router.post(
    "/login",validate(loginSchema),login
);

router.post(
    "/logout",
    logout
);


module.exports=router;