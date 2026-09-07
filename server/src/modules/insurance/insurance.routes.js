const express = require("express");

const validate = require("../../middleware/validate");
const authenticate = require("../../middleware/auth");
const authorize = require("../../middleware/authorize");
const upload = require("../../middleware/upload");
const validateInsuranceImages = require("../../middleware/validate-insurance-images");

const {
    createInsuranceSchema,
} = require("./insurance.validation");

const {
    createInsurance,
    getMyInsurance,
} = require("./insurance.controller");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("patient.self.update"),

    upload.fields([
        {
            name: "frontCardImage",
            maxCount: 1,
        },
        {
            name: "backCardImage",
            maxCount: 1,
        },
    ]),

    validateInsuranceImages,

    validate(createInsuranceSchema),

    createInsurance
);

router.get(
    "/",
    authenticate,
    authorize("patient.self.read"),
    getMyInsurance
);

module.exports = router;
