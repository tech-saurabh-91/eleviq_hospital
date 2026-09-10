const validate = (schema) => {
    return (req, res, next) => {

        console.log("BEFORE VALIDATION:", req.body);
        console.log("BEFORE RELATIONSHIP:", req.body.relationship);

        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues,
            });
        }

        console.log("AFTER VALIDATION:", result.data);
        console.log("AFTER RELATIONSHIP:", result.data.relationship);

        req.body = result.data;

        next();
    };
};

module.exports = validate;