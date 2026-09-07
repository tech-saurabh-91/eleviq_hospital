const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../users/user.model");
const Patient = require("../patients/patient.model");
const Role = require("../roles/role.model");
const Permission = require("../permissions/permission.model");
const LoginSession = require("./login-session.model");

const getDeviceInfo = (userAgent = "") => {
    if (/iphone/i.test(userAgent)) return "iPhone";
    if (/ipad/i.test(userAgent)) return "iPad";
    if (/android/i.test(userAgent)) return "Android";
    if (/windows/i.test(userAgent)) return "Windows";
    if (/macintosh|mac os/i.test(userAgent)) return "macOS";
    if (/linux/i.test(userAgent)) return "Linux";

    return "Unknown";
};

const loginUser = async (identifier, password, sessionInfo) => {
    let account = await User.findOne({
        $or: [
            { username: identifier },
            { mobile: identifier },
            { email: identifier.toLowerCase() },
        ],
    }).populate({
        path: "roles",
        populate: {
            path: "permissions",
        },
    });

    let accountType = "user";

    if (!account) {
        account = await Patient.findOne({
            $or: [
                { username: identifier },
                { mobile: identifier },
                { email: identifier.toLowerCase() },
            ],
        }).populate({
            path: "roles",
            populate: {
                path: "permissions",
            },
        });

        accountType = "patient";
    }

    if (!account) {
        throw new Error("Invalid username/mobile/email or password");
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        account.passwordHash
    );

    if (!isPasswordValid) {
        throw new Error("Invalid username/mobile/email or password");
    }

    const loginSession = await LoginSession.create({
        accountId: account._id,
        accountType,
        ipAddress: sessionInfo.ipAddress,
        userAgent: sessionInfo.userAgent,
        deviceInfo: getDeviceInfo(sessionInfo.userAgent),
    });

    const token = jwt.sign(
        {
            accountId: account._id.toString(),
            accountType,
            sessionId: loginSession._id.toString(),
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1h",
        }
    );

    return { account, accountType, token };
}

module.exports = { loginUser };