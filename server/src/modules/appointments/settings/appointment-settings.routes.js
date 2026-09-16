const express = require("express");

const authenticate = require("../../../middleware/auth");
const authorize = require("../../../middleware/authorize");
const validate = require("../../../middleware/validate");

const {
    appointmentSettingsSchema,
} = require("./appointment-settings.validation");

const {
    getAppointmentSettings,
    updateAppointmentSettings,
} = require("./appointment-settings.controller");

const router = express.Router();

router.get(
    "/",
    authenticate,
    authorize("appointment.settings.read"),
    getAppointmentSettings
);

router.patch(
    "/",
    authenticate,
    authorize("appointment.settings.update"),
    validate(appointmentSettingsSchema),
    updateAppointmentSettings
);

module.exports = router;