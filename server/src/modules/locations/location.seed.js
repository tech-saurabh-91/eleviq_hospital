require("dotenv").config();

const connectDatabase = require("../../config/database");
const Location = require("./location.model");

const locations = [
    {
        state: "Maharashtra",
        cities: [
            "Mumbai",
            "Pune",
            "Nagpur",
            "Nashik",
            "Thane",
            "Aurangabad",
            "Kolhapur",
        ],
    },
    {
        state: "Gujarat",
        cities: [
            "Ahmedabad",
            "Surat",
            "Vadodara",
            "Rajkot",
            "Gandhinagar",
        ],
    },
    {
        state: "Karnataka",
        cities: [
            "Bengaluru",
            "Mysuru",
            "Mangaluru",
            "Hubballi",
            "Belagavi",
        ],
    },
    {
        state: "Delhi",
        cities: [
            "New Delhi",
            "Delhi",
        ],
    },
];

const seedLocations = async () => {
    try {
        await connectDatabase();

        await Location.deleteMany({});

        await Location.insertMany(locations);

        console.log("Location data seeded successfully");

        process.exit(0);
    } catch (error) {
        console.error("Location seed failed:", error.message);
        process.exit(1);
    }
};

seedLocations();