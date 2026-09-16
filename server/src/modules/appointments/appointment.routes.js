const express = require("express");

const authenticate = require("../../middleware/auth");
const authorize = require("../../middleware/authorize");
const validate = require("../../middleware/validate");

const {
    createAppointmentSchema,
    rescheduleAppointmentSchema,
} = require("./appointment.validation");

const {
    createAppointment,
    getAvailableAppointmentSlots,
    getAvailableDoctors,
    getMyAppointments,
    getMyAppointment,
    verifyAppointment,
    confirmAppointment,
    rescheduleAppointmentController,
} = require("./appointment.controller");

const appointmentSettingsRoutes = require(
    "./settings/appointment-settings.routes"
);

const router = express.Router();

router.use(
    "/settings",
    appointmentSettingsRoutes
);

router.post(
    "/",
    authenticate,
    authorize("appointment.self.create"),
    validate(createAppointmentSchema),
    createAppointment
);

router.get(
    "/",
    authenticate,
    authorize("appointment.self.read"),
    getMyAppointments
);

router.get(
    "/doctors",
    authenticate,
    authorize("appointment.self.create"),
    getAvailableDoctors
);

router.get(
    "/available-slots",
    authenticate,
    authorize("appointment.self.create"),
    getAvailableAppointmentSlots
);

router.patch(
  "/:appointmentId/verify",
  authenticate,
  authorize("appointment.verify"),
  verifyAppointment
);

router.patch(
  "/:appointmentId/confirm",
  authenticate,
  authorize("appointment.confirm"),
  confirmAppointment
);

router.patch(
  "/:appointmentId/reschedule",
  authenticate,
  authorize("appointment.self.update"),
  validate(rescheduleAppointmentSchema),
  rescheduleAppointmentController
);

router.get(
    "/:appointmentId",
    authenticate,
    authorize("appointment.self.read"),
    getMyAppointment
);

module.exports = router;