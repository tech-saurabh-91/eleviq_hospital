const validateInsuranceImages = async (req, res, next) => {
    try {
        if (!req.files) {
            return next();
        }

        const { fileTypeFromBuffer } = await import("file-type");

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
        ];

        const files = [];

        if (req.files.frontCardImage) {
            files.push(...req.files.frontCardImage);
        }

        if (req.files.backCardImage) {
            files.push(...req.files.backCardImage);
        }

        for (const file of files) {
            const fileType = await fileTypeFromBuffer(file.buffer);

            if (!fileType || !allowedTypes.includes(fileType.mime)) {
                return res.status(400).json({
                    success: false,
                    message: "Only JPG, PNG, and GIF images are allowed",
                });
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = validateInsuranceImages;