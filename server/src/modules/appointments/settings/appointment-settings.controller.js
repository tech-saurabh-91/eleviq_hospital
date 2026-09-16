const appointmentSettingsService = require(
    "./appointment-settings.service"
);

const getAppointmentSettings = async (req, res, next) => {
    try {
        const settings =
            await appointmentSettingsService.getAppointmentSettings();

        return res.status(200).json({
            success: true,
            data: settings,
        });
    } catch (error) {
        next(error);
    }
};

const updateAppointmentSettings = async (req, res, next) => {
    try {
        const settings =
            await appointmentSettingsService.updateAppointmentSettings(
                req.body
            );

        return res.status(200).json({
            success: true,
            message: "Appointment settings updated successfully",
            data: settings,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAppointmentSettings,
    updateAppointmentSettings,
};