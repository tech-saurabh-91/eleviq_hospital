const parseRegistrationForm = (req, res, next) => {
    try {
        if (typeof req.body.address === "string") {
            req.body.address = JSON.parse(req.body.address);
        }

        if (typeof req.body.confirmationAccepted === "string") {
            req.body.confirmationAccepted =
                req.body.confirmationAccepted === "true";
        }

        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid registration form data",
        });
    }
};

module.exports = parseRegistrationForm;