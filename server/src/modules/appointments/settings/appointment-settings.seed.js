require("dotenv").config();

const connectDatabase = require("../../../config/database");
const AppointmentSettings = require("./appointment-settings.model");

const seedAppointmentSettings = async () => {
    try {
        await connectDatabase();

        await AppointmentSettings.findOneAndUpdate(
            { key: "default" },
            {
                key: "default",

                appointmentDuration: 15,

                morningSchedule: {
                    startTime: "09:00",
                    endTime: "13:00",
                },

                eveningSchedule: {
                    startTime: "17:00",
                    endTime: "22:00",
                },

                payment: {
                    enabled: false,
                    appointmentFee: 0,
                },

                status: "active",
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        );

        console.log(
            "Appointment settings seeded successfully"
        );

        process.exit(0);
    } catch (error) {
        console.error(
            "Appointment settings seed failed:",
            error.message
        );

        process.exit(1);
    }
};

seedAppointmentSettings();