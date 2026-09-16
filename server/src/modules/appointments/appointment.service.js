const mongoose = require("mongoose");

const Appointment = require("./appointment.model");
const AppointmentSettings = require("./settings/appointment-settings.model");

const Patient = require("../patients/patient.model");
const FamilyMember = require("../patients/family/family-member.model");
const User = require("../users/user.model");

const { sendEmail } = require("../../services/email.service");

const getActiveAppointmentSettings = async () => {
    const settings = await AppointmentSettings.findOne({
        key: "default",
        status: "active",
    });

    if (!settings) {
        throw new Error("Appointment settings are not configured");
    }

    return settings;
};

const getActiveDoctor = async (doctorId) => {
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        throw new Error("Invalid doctor ID");
    }

    const doctor = await User.findOne({
        _id: doctorId,
        status: "active",
    }).populate("roles");

    if (!doctor) {
        throw new Error("Doctor not found");
    }

    const isDoctor = doctor.roles?.some(
        (role) => role.name === "doctor"
    );

    if (!isDoctor) {
        throw new Error("Selected user is not a doctor");
    }

    return doctor;
};

const getAvailableDoctors = async () => {
    const doctors = await User.find({
        status: "active",
    })
        .populate({
            path: "roles",
            match: { name: "doctor" },
            select: "name",
        })
        .select("_id username mobile");

    return doctors
        .filter((doctor) => doctor.roles?.length > 0)
        .map((doctor) => ({
            doctorId: doctor._id,
            username: doctor.username,
            mobile: doctor.mobile,
        }));
};

const getFamilyMember = async (patientId, familyMemberId) => {
    if (!mongoose.Types.ObjectId.isValid(familyMemberId)) {
        throw new Error("Invalid family member ID");
    }

    const familyMember = await FamilyMember.findOne({
        _id: familyMemberId,
        patient: patientId,
        status: "active",
    });

    if (!familyMember) {
        throw new Error("Family member not found");
    }

    return familyMember;
};

const validateAppointmentDate = (appointmentDate) => {
    const today = new Date();

    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
    ].join("-");

    if (appointmentDate < todayString) {
        throw new Error("Appointment date cannot be in the past");
    }
};

const validateAppointmentTime = (appointmentDate, startTime) => {
    const today = new Date();

    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
    ].join("-");

    // Future date — no need to compare the clock time
    if (appointmentDate > todayString) {
        return;
    }

    // Same date — selected time must still be in the future
    if (appointmentDate === todayString) {
        const currentMinutes =
            today.getHours() * 60 + today.getMinutes();

        const selectedMinutes = timeToMinutes(startTime);

        if (selectedMinutes <= currentMinutes) {
            throw new Error(
                "Selected appointment time has already passed"
            );
        }
    }
};

const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);

    return (hours * 60) + minutes;
};

const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}`;
};

const generateSlotsForSchedule = (
    startTime,
    endTime,
    duration
) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    const slots = [];

    for (
        let current = startMinutes;
        current + duration <= endMinutes;
        current += duration
    ) {
        slots.push({
            startTime: minutesToTime(current),
            endTime: minutesToTime(current + duration),
        });
    }

    return slots;
};

const generateAppointmentSlots = (settings) => {
    const morningSlots = generateSlotsForSchedule(
        settings.morningSchedule.startTime,
        settings.morningSchedule.endTime,
        settings.appointmentDuration
    );

    const eveningSlots = generateSlotsForSchedule(
        settings.eveningSchedule.startTime,
        settings.eveningSchedule.endTime,
        settings.appointmentDuration
    );

    return [
        ...morningSlots,
        ...eveningSlots,
    ];
};

const isValidAppointmentSlot = (
    startTime,
    settings
) => {
    const slots = generateAppointmentSlots(settings);

    return slots.some(
        (slot) => slot.startTime === startTime
    );
};

const isDuplicateAppointmentError = (error) => {
    return error?.code === 11000;
};

const createAppointment = async (patientId, appointmentData) => {
    // 1. Verify patient exists and is active
    const patient = await Patient.findOne({
        _id: patientId,
        status: "active",
    });

    if (!patient) {
        throw new Error("Patient not found");
    }

    // 2. Validate appointment date
    validateAppointmentDate(appointmentData.appointmentDate);

    validateAppointmentTime(
        appointmentData.appointmentDate,
        appointmentData.startTime
    );

    // 3. Get current appointment settings
    const settings = await getActiveAppointmentSettings();

    // 4. Validate selected doctor
    await getActiveDoctor(appointmentData.doctorId);

    // 5. Validate family member if booking for family
    let familyMember = null;

    if (appointmentData.familyMemberId) {
        familyMember = await getFamilyMember(
            patientId,
            appointmentData.familyMemberId
        );
    }

    // 6. Validate requested slot
    const isValidSlot = isValidAppointmentSlot(
        appointmentData.startTime,
        settings
    );

    if (!isValidSlot) {
        throw new Error("Invalid appointment slot");
    }

    // 7. Find the actual end time from the generated slots
    const availableSlots = generateAppointmentSlots(settings);

    const selectedSlot = availableSlots.find(
        (slot) => slot.startTime === appointmentData.startTime
    );

    if (!selectedSlot) {
        throw new Error("Invalid appointment slot");
    }

    // 8. Check whether the doctor is already booked
    const existingAppointment = await Appointment.findOne({
        doctor: appointmentData.doctorId,
        appointmentDate: appointmentData.appointmentDate,
        startTime: selectedSlot.startTime,
    });

    if (existingAppointment) {
        const error = new Error(
            "Selected appointment slot is already booked"
        );

        error.statusCode = 409;

        throw error;
    }

    // 9. Determine payment status
    let paymentStatus = "NOT_REQUIRED";
    let paymentMethod;

    if (settings.payment.enabled) {
        if (!appointmentData.paymentMethod) {
            throw new Error("Payment method is required");
        }

        throw new Error(
            "Online payment is not configured yet"
        );
    }

    // 10. Create appointment
    try {
        const appointment = await Appointment.create({
            patient: patient._id,
            familyMember: familyMember?._id || null,
            doctor: appointmentData.doctorId,
            appointmentType: appointmentData.appointmentType,
            appointmentDate: appointmentData.appointmentDate,
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
            visitReason: appointmentData.visitReason,
            status: "BOOKED",
            payment: {
                status: paymentStatus,
                method: paymentMethod,
                amount: settings.payment.enabled
                    ? settings.payment.appointmentFee
                    : 0,
            },
        });

        return appointment;
    } catch (error) {
        if (isDuplicateAppointmentError(error)) {
            const duplicateError = new Error(
                "Selected appointment slot is no longer available"
            );

            duplicateError.statusCode = 409;

            throw duplicateError;
        }

        throw error;
    }
};

const getAvailableAppointmentSlots = async (
    doctorId,
    appointmentDate
) => {
    validateAppointmentDate(appointmentDate);

    await getActiveDoctor(doctorId);

    const settings = await getActiveAppointmentSettings();

    const allSlots = generateAppointmentSlots(settings);

    const bookedAppointments = await Appointment.find({
        doctor: doctorId,
        appointmentDate,
        status: {
            $in: [
                "BOOKED",
                "VERIFIED",
                "CONFIRMED",
            ],
        },
    }).select("startTime");

    const bookedTimes = new Set(
        bookedAppointments.map(
            (appointment) => appointment.startTime
        )
    );

    const today = new Date();

    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
    ].join("-");

    const currentMinutes =
        today.getHours() * 60 + today.getMinutes();

    return allSlots
        .filter((slot) => {
            if (appointmentDate !== todayString) {
                return true;
            }

            return timeToMinutes(slot.startTime) > currentMinutes;
        })
        .map((slot) => ({
            ...slot,
            available: !bookedTimes.has(slot.startTime),
        }));
};

const buildAppointmentResponse = (appointment) => {
    return {
        appointmentId: appointment._id,

        doctor: appointment.doctor
            ? {
                doctorId: appointment.doctor._id,
                username: appointment.doctor.username,
                mobile: appointment.doctor.mobile,
            }
            : null,

        appointmentFor: appointment.familyMember
            ? {
                type: "FAMILY",
                familyMemberId: appointment.familyMember._id,
                firstName: appointment.familyMember.firstName,
                middleName: appointment.familyMember.middleName,
                lastName: appointment.familyMember.lastName,
                relationship: appointment.familyMember.relationship,
            }
            : {
                type: "SELF",
            },

        appointmentType: appointment.appointmentType,
        appointmentDate: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        visitReason: appointment.visitReason,
        status: appointment.status,

        payment: {
            status: appointment.payment?.status,
            method: appointment.payment?.method,
            amount: appointment.payment?.amount,
        },

        verifiedAt: appointment.verifiedAt,
        confirmedAt: appointment.confirmedAt,

        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
    };
};


const getMyAppointments = async (patientId) => {
    const appointments = await Appointment.find({
        patient: patientId,
    })
        .populate({
            path: "doctor",
            select: "username mobile",
        })
        .populate({
            path: "familyMember",
            select: "firstName middleName lastName relationship",
        })
        .sort({
            appointmentDate: 1,
            startTime: 1,
        });

    return appointments.map(buildAppointmentResponse);
};


const getMyAppointment = async (
    patientId,
    appointmentId
) => {
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        throw new Error("Invalid appointment ID");
    }

    const appointment = await Appointment.findOne({
        _id: appointmentId,
        patient: patientId,
    })
        .populate({
            path: "doctor",
            select: "username mobile",
        })
        .populate({
            path: "familyMember",
            select: "firstName middleName lastName relationship",
        });

    if (!appointment) {
        throw new Error("Appointment not found");
    }

    return buildAppointmentResponse(appointment);
};

const verifyAppointment = async (appointmentId) => {
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        const error = new Error("Invalid appointment ID");
        error.statusCode = 400;
        throw error;
    }

    const appointment = await Appointment.findById(
        appointmentId
    );

    if (!appointment) {
        const error = new Error("Appointment not found");
        error.statusCode = 404;
        throw error;
    }

    if (appointment.status !== "BOOKED") {
        const error = new Error(
            "Only booked appointments can be verified"
        );

        error.statusCode = 409;

        throw error;
    }

    appointment.status = "VERIFIED";
    appointment.verifiedAt = new Date();

    await appointment.save();

    return buildAppointmentResponse(
        await appointment.populate([
            {
                path: "doctor",
                select: "username mobile",
            },
            {
                path: "familyMember",
                select: "firstName middleName lastName relationship",
            },
        ])
    );
};


const confirmAppointment = async (appointmentId) => {
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        const error = new Error("Invalid appointment ID");
        error.statusCode = 400;
        throw error;
    }

    const appointment = await Appointment.findById(
        appointmentId
    );

    if (!appointment) {
        const error = new Error("Appointment not found");
        error.statusCode = 404;
        throw error;
    }

    if (appointment.status !== "VERIFIED") {
        const error = new Error(
            "Only verified appointments can be confirmed"
        );

        error.statusCode = 409;

        throw error;
    }

    const wasRescheduled = Boolean(appointment.rescheduledAt);

    appointment.status = "CONFIRMED";
    appointment.confirmedAt = new Date();

    await appointment.save();

    await appointment.populate([
        {
            path: "doctor",
            select: "username mobile",
        },
        {
            path: "familyMember",
            select: "firstName middleName lastName relationship",
        },
    ]);

    const patient = await Patient.findById(
        appointment.patient
    ).select("email firstName lastName");

    if (patient?.email) {
        const appointmentFor = appointment.familyMember
            ? `${appointment.familyMember.firstName} ${appointment.familyMember.lastName}`
            : `${patient.firstName} ${patient.lastName}`;

        await sendEmail({
            to: patient.email,
            subject: wasRescheduled
                ? "Appointment Rescheduled & Confirmed"
                : "Appointment Confirmed",
            text: [
                wasRescheduled
                    ? "Your appointment has been rescheduled and confirmed."
                    : "Your appointment has been confirmed.",
                "",
                `Appointment for: ${appointmentFor}`,
                `Doctor: ${appointment.doctor?.username || "N/A"}`,
                `Date: ${appointment.appointmentDate}`,
                `Time: ${appointment.startTime} - ${appointment.endTime}`,
                `Type: ${appointment.appointmentType}`,
            ].join("\n"),
            html: `
                <h2>${wasRescheduled
                    ? "Appointment Rescheduled & Confirmed"
                    : "Appointment Confirmed"
                }</h2>

                <p>${wasRescheduled
                    ? "Your appointment has been rescheduled and confirmed."
                    : "Your appointment has been confirmed."
                }</p>
                <p>
                    <strong>Appointment for:</strong> ${appointmentFor}<br>
                    <strong>Doctor:</strong> ${appointment.doctor?.username || "N/A"}<br>
                    <strong>Date:</strong> ${appointment.appointmentDate}<br>
                    <strong>Time:</strong> ${appointment.startTime} - ${appointment.endTime}<br>
                    <strong>Type:</strong> ${appointment.appointmentType}
                </p>
            `,
        });
    }

    
    if (wasRescheduled) {
        appointment.rescheduledAt = null;
        await appointment.save();
    }
    
    return buildAppointmentResponse(appointment);
};

const rescheduleAppointment = async (
    patientId,
    appointmentId,
    appointmentDate,
    startTime
) => {
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        const error = new Error("Invalid appointment ID");
        error.statusCode = 400;
        throw error;
    }

    const appointment = await Appointment.findOne({
        _id: appointmentId,
        patient: patientId,
    });

    if (!appointment) {
        const error = new Error("Appointment not found");
        error.statusCode = 404;
        throw error;
    }

    if (appointment.status !== "CONFIRMED") {
        const error = new Error(
            "Only confirmed appointments can be rescheduled"
        );
        error.statusCode = 409;
        throw error;
    }

    const settings = await getActiveAppointmentSettings();

    if (!settings) {
        const error = new Error("Appointment settings are not available");
        error.statusCode = 500;
        throw error;
    }

    const today = new Date();

    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
    ].join("-");

    if (appointmentDate < todayString) {
        const error = new Error("Appointment date cannot be in the past");
        error.statusCode = 400;
        throw error;
    }

    const currentMinutes =
        today.getHours() * 60 + today.getMinutes();

    if (
        appointmentDate === todayString &&
        timeToMinutes(startTime) <= currentMinutes
    ) {
        const error = new Error(
            "Selected appointment time has already passed"
        );
        error.statusCode = 400;
        throw error;
    }

    const availableSlots = generateAppointmentSlots(settings);

    const selectedSlot = availableSlots.find(
        (slot) => slot.startTime === startTime
    );

    if (!selectedSlot) {
        const error = new Error("Invalid appointment slot");
        error.statusCode = 400;
        throw error;
    }

    const endTime = selectedSlot.endTime;

    const existingAppointment = await Appointment.findOne({
        doctor: appointment.doctor,
        appointmentDate,
        startTime,
        _id: { $ne: appointmentId },
        status: { $in: ["BOOKED", "VERIFIED", "CONFIRMED"] },
    });

    if (existingAppointment) {
        const error = new Error(
            "Selected appointment slot is already booked"
        );
        error.statusCode = 409;
        throw error;
    }

    appointment.appointmentDate = appointmentDate;
    appointment.startTime = startTime;
    appointment.endTime = endTime;

    appointment.rescheduledAt = new Date();

    // A rescheduled appointment must go through back-office verification again.
    appointment.status = "BOOKED";
    appointment.verifiedAt = undefined;
    appointment.confirmedAt = undefined;

    try {
        await appointment.save();
    } catch (error) {
        if (error?.code === 11000) {
            const conflictError = new Error(
                "Selected appointment slot is no longer available"
            );
            conflictError.statusCode = 409;
            throw conflictError;
        }

        throw error;
    }

    await appointment.populate([
        {
            path: "doctor",
            select: "username mobile",
        },
        {
            path: "familyMember",
            select: "firstName middleName lastName relationship",
        },
    ]);

    return buildAppointmentResponse(appointment);
};

module.exports = {
    getActiveAppointmentSettings,
    getActiveDoctor,
    getAvailableDoctors,
    getFamilyMember,
    validateAppointmentDate,
    validateAppointmentTime,
    generateAppointmentSlots,
    isValidAppointmentSlot,
    createAppointment,
    getAvailableAppointmentSlots,
    getMyAppointments,
    getMyAppointment,
    verifyAppointment,
    confirmAppointment,
    rescheduleAppointment,
};