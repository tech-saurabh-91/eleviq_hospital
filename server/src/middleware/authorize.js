const User = require("../modules/users/user.model");
const Patient = require("../modules/patients/patient.model");
const Role = require("../modules/roles/role.model");
const Permission = require("../modules/permissions/permission.model");

const authorize = (requiredPermission) => {
    return async (req, res, next) => {
        try {

            if (!req.user || !req.user._id) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            let account;

            if (req.accountType === "patient") {
                account = await Patient.findById(req.user._id).populate({
                    path: "roles",
                    populate: {
                        path: "permissions",
                    },
                });
            } else {
                account = await User.findById(req.user._id).populate({
                    path: "roles",
                    populate: {
                        path: "permissions",
                    },
                });
            }

            if (!account) {
                return res.status(401).json({
                    success: false,
                    message: "Account not found",
                });
            }

            const hasPermission = account.roles.some((role) =>
                role.permissions.some(
                    (permission) => permission.name === requiredPermission
                )
            );

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied",
                });
            }

            req.userData = account;
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Authorization failed",
            });
        }
    };
};

module.exports = authorize;