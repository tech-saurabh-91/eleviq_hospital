const express = require("express");

const validate = require("../../middleware/validate");
const authenticate = require("../../middleware/auth");
const authorize = require("../../middleware/authorize");
const upload = require("../../middleware/upload");
const validateInsuranceImages = require("../../middleware/validate-insurance-images");

const {
    createInsuranceSchema,
    updateInsuranceSchema,
} = require("./insurance.validation");

const {
    createInsurance,
    getMyInsurance,
    getInsuranceById,
    updateInsurance,
    deleteInsurance,
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

router.get(
    "/:insuranceId",
    authenticate,
    authorize("patient.self.read"),
    getInsuranceById
);

router.patch(
    "/:insuranceId",
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

    validate(updateInsuranceSchema),

    updateInsurance
);

router.delete(
    "/:insuranceId",
    authenticate,
    authorize("patient.self.update"),
    deleteInsurance
);

module.exports = router;
