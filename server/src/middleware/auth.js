const jwt = require("jsonwebtoken");
const User = require("../modules/users/user.model");
const Patient = require("../modules/patients/patient.model");

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        let account;

        if (decoded.accountType === "patient") {
            account = await Patient.findById(decoded.accountId).populate("roles");
        } else {
            account = await User.findById(decoded.accountId).populate("roles");
        }

        if (!account) {
            return res.status(401).json({
                success: false,
                message: "Account not found",
            });
        }

        req.user = account;
        req.accountType = decoded.accountType;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token",
        });
    }
};

module.exports = authenticate;