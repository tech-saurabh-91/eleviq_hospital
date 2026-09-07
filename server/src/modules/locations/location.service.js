const Location = require("./location.model");

const getAllLocations = async () => {
    return Location.find({})
        .sort({ stateName: 1, localBodyName: 1 })
        .lean();
};

const getAllStates = async () => {
    return Location.aggregate([
        {
            $match: {
                stateCode: { $ne: null },
                stateName: { $ne: null },
            },
        },

        {
            $group: {
                _id: "$stateCode",
                stateCode: { $first: "$stateCode" },
                stateName: { $first: "$stateName" },
            },
        },
        {
            $sort: {
                stateName: 1,
            },
        },
        {
            $project: {
                _id: 0,
                stateCode: 1,
                stateName: 1,
            },
        },
    ]);
};

const getCitiesByState = async (state) => {
    const cities = await Location.aggregate([
        {
            $match: {
                stateName: {
                    $regex: `^${state}$`,
                    $options: "i",
                },
            },
        },
        {
            $group: {
                _id: "$localBodyCode",
                localBodyCode: { $first: "$localBodyCode" },
                cityName: { $first: "$localBodyName" },
                localBodyType: { $first: "$localBodyType" },
                pincodes: {
                    $addToSet: "$pincode",
                },
            },
        },
        {
            $sort: {
                cityName: 1,
            },
        },
        {
            $project: {
                _id: 0,
                localBodyCode: 1,
                cityName: 1,
                localBodyType: 1,
                pincodes: 1,
            },
        },
    ]);

    if (cities.length === 0) {
        throw new Error("State not found");
    }

    return cities;
};

module.exports = {
    getAllLocations,
    getAllStates,
    getCitiesByState,
};