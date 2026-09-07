const { loginUser } = require("./auth.service");
const jwt = require("jsonwebtoken");
const LoginSession = require("./login-session.model");

const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const { account, accountType, token } = await loginUser(
            identifier,
            password,
            {
                ipAddress: req.ip,
                userAgent: req.get("user-agent"),
            }
        );

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 1000,
        })

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: account._id,
                accountType,
                username: account.username,
                mobile: account.mobile,
                roles: account.roles.map((role) => role.name),
            },
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

const logout = async (req, res) => {
    try {
        const token = req.cookies.accessToken;

        if (token) {
            try {
                const decoded = jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );

                if (decoded.sessionId) {
                    await LoginSession.findByIdAndUpdate(
                        decoded.sessionId,
                        {
                            logoutAt: new Date(),
                        }
                    );
                }
            } catch (error) {
                // Token may already be expired.
                // Cookie will still be cleared below.
            }
        }

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};

module.exports = {
    login,
    logout,
};