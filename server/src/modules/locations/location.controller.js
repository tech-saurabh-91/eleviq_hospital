const {
    getAllLocations,
    getAllStates,
    getCitiesByState,
} = require("./location.service");

const getLocations = async (req, res) => {
    try {
        const locations = await getAllLocations();

        return res.status(200).json({
            success: true,
            data: locations,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch locations",
        });
    }
};

const getStates = async (req, res) => {
    try {
        const states = await getAllStates();

        return res.status(200).json({
            success: true,
            data: states,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch states",
        });
    }
};

const getStateCities = async (req, res) => {
    try {
        const { state } = req.params;

        const cities = await getCitiesByState(state);

        return res.status(200).json({
            success: true,
            data: {
                state,
                cities,
            },
        });
    } catch (error) {
        if (error.message === "State not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to fetch cities",
        });
    }
};

module.exports = {
    getLocations,
    getStates,
    getStateCities,
};