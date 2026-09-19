const express = require("express");

const authenticate = require("../../middleware/auth");
const authorize = require("../../middleware/authorize");
const validate = require("../../middleware/validate");

const {
    createClinicalRecordSchema,
} = require("./clinical-record.validation");

const {
    createClinicalRecordController,
    getClinicalRecordController,
    getMyClinicalHistoryController,
    getDoctorClinicalHistoryController,
} = require("./clinical-record.controller");

const router = express.Router();

// Doctor creates and finalizes a clinical record
router.post(
    "/",
    authenticate,
    authorize("clinical.create"),
    validate(createClinicalRecordSchema),
    createClinicalRecordController
);

// Patient views own clinical history
router.get(
    "/my-history",
    authenticate,
    authorize("prescription.self.read"),
    getMyClinicalHistoryController
);

// Assigned doctor views patient's previous clinical history
router.get(
    "/appointment/:appointmentId/history",
    authenticate,
    authorize("clinical.read"),
    getDoctorClinicalHistoryController
);

// Patient views one finalized clinical record
router.get(
    "/:recordId",
    authenticate,
    authorize("prescription.self.read"),
    getClinicalRecordController
);

module.exports = router;