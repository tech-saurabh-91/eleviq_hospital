const AppointmentSettings = require("./appointment-settings.model");

const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);

    return (hours * 60) + minutes;
};

const validateSchedule = (
    scheduleName,
    schedule,
    appointmentDuration
) => {
    const startMinutes = timeToMinutes(schedule.startTime);
    const endMinutes = timeToMinutes(schedule.endTime);

    if (endMinutes <= startMinutes) {
        throw new Error(
            `${scheduleName} end time must be after start time`
        );
    }

    const scheduleDuration = endMinutes - startMinutes;

    if (scheduleDuration % appointmentDuration !== 0) {
        throw new Error(
            `${scheduleName} duration must be divisible by appointment duration`
        );
    }
};

const validateAppointmentSettings = (settingsData) => {
    const {
        appointmentDuration,
        morningSchedule,
        eveningSchedule,
        payment,
    } = settingsData;

    validateSchedule(
        "Morning schedule",
        morningSchedule,
        appointmentDuration
    );

    validateSchedule(
        "Evening schedule",
        eveningSchedule,
        appointmentDuration
    );

    if (
        payment.enabled &&
        (!Number.isFinite(payment.appointmentFee) ||
            payment.appointmentFee <= 0)
    ) {
        throw new Error(
            "Appointment fee must be greater than 0 when payment is enabled"
        );
    }

    if (
        !payment.enabled &&
        payment.appointmentFee < 0
    ) {
        throw new Error(
            "Appointment fee cannot be negative"
        );
    }
};

const getAppointmentSettings = async () => {
    const settings = await AppointmentSettings.findOne({
        key: "default",
    });

    if (!settings) {
        throw new Error(
            "Appointment settings are not configured"
        );
    }

    return settings;
};

const updateAppointmentSettings = async (settingsData) => {
    const currentSettings = await getAppointmentSettings();

    const updatedSettings = {
        appointmentDuration:
            settingsData.appointmentDuration ??
            currentSettings.appointmentDuration,

        morningSchedule:
            settingsData.morningSchedule ??
            currentSettings.morningSchedule,

        eveningSchedule:
            settingsData.eveningSchedule ??
            currentSettings.eveningSchedule,

        payment:
            settingsData.payment ??
            currentSettings.payment,

        status:
            settingsData.status ??
            currentSettings.status,
    };

    validateAppointmentSettings(updatedSettings);

    currentSettings.appointmentDuration =
        updatedSettings.appointmentDuration;

    currentSettings.morningSchedule =
        updatedSettings.morningSchedule;

    currentSettings.eveningSchedule =
        updatedSettings.eveningSchedule;

    currentSettings.payment =
        updatedSettings.payment;

    currentSettings.status =
        updatedSettings.status;

    await currentSettings.save();

    return currentSettings;
};

module.exports = {
    getAppointmentSettings,
    updateAppointmentSettings,
};