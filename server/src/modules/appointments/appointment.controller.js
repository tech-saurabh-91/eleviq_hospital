const appointmentService = require("./appointment.service");

const createAppointment = async (req, res, next) => {
    try {
        const appointment = await appointmentService.createAppointment(
            req.user._id,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};

const getAvailableAppointmentSlots = async (req, res, next) => {
    try {
        const {
            doctorId,
            appointmentDate,
        } = req.query;

        const slots =
            await appointmentService.getAvailableAppointmentSlots(
                doctorId,
                appointmentDate
            );

        return res.status(200).json({
            success: true,
            data: slots,
        });
    } catch (error) {
        next(error);
    }
};

const getAvailableDoctors = async (req, res, next) => {
    try {
        const doctors =
            await appointmentService.getAvailableDoctors();

        return res.status(200).json({
            success: true,
            data: doctors,
        });
    } catch (error) {
        next(error);
    }
};

const getMyAppointments = async (req, res, next) => {
    try {
        const appointments =
            await appointmentService.getMyAppointments(
                req.user._id
            );

        return res.status(200).json({
            success: true,
            data: appointments,
        });
    } catch (error) {
        next(error);
    }
};


const getMyAppointment = async (req, res, next) => {
    try {
        const appointment =
            await appointmentService.getMyAppointment(
                req.user._id,
                req.params.appointmentId
            );

        return res.status(200).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};

const verifyAppointment = async (req, res, next) => {
    try {
        const appointment =
            await appointmentService.verifyAppointment(
                req.params.appointmentId
            );

        return res.status(200).json({
            success: true,
            message: "Appointment verified successfully",
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};


const confirmAppointment = async (req, res, next) => {
    try {
        const appointment =
            await appointmentService.confirmAppointment(
                req.params.appointmentId
            );

        return res.status(200).json({
            success: true,
            message: "Appointment confirmed successfully",
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};

const rescheduleAppointmentController = async (req, res, next) => {
  try {
    const appointment = await appointmentService.rescheduleAppointment(
      req.user._id,
      req.params.appointmentId,
      req.body.appointmentDate,
      req.body.startTime
    );

    return res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
    createAppointment,
    getAvailableAppointmentSlots,
    getAvailableDoctors,
    getMyAppointments,
    getMyAppointment,
    verifyAppointment,
    confirmAppointment,
    rescheduleAppointmentController,
};