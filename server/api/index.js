const mongoose = require("mongoose");
const app = require("../src/app");

let connection;

const connect = () => {
    if (!connection) {
        connection = mongoose.connect(process.env.MONGO_URI).catch((error) => {
            connection = undefined;
            throw error;
        });
    }
    return connection;
};

module.exports = async (req, res) => {
    try {
        await connect();
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        return res.status(500).json({ success: false, message: "Database connection failed" });
    }
    return app(req, res);
};
