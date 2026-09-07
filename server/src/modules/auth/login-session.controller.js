const { getUserSessions } = require("./login-session.service");

const getMySessions = async (req, res) => {
    try {
        const sessions = await getUserSessions(req.user._id);

        return res.status(200).json({
            success: true,
            data: sessions,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch login sessions",
        });
    }
};

module.exports = {
    getMySessions,
};