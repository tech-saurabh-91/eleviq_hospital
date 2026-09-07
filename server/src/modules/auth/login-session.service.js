const LoginSession = require("./login-session.model");

const formatDuration = (start, end) => {
    const totalSeconds = Math.floor(
        (end.getTime() - start.getTime()) / 1000
    );

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
        days,
        hours,
        minutes,
        seconds,
    };
};

const getUserSessions = async (userId) => {
    const sessions = await LoginSession.find({ accountId: userId })
        .sort({ loginAt: -1 })
        .lean();

    return sessions.map((session) => {
        const duration = session.logoutAt
            ? formatDuration(session.loginAt, session.logoutAt)
            : null;

        const durationSeconds = session.logoutAt
            ? Math.floor(
                  (session.logoutAt.getTime() - session.loginAt.getTime()) /
                      1000
              )
            : null;

        return {
            id: session._id,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
            deviceInfo: session.deviceInfo,
            loginAt: session.loginAt,
            logoutAt: session.logoutAt,
            durationSeconds,
            duration,
        };
    });
};

module.exports = {
    getUserSessions,
};