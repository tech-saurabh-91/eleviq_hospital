const validateImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }

        const { fileTypeFromBuffer } = await import("file-type");

        const fileType = await fileTypeFromBuffer(
            req.file.buffer
        );

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
        ];

        if (
            !fileType ||
            !allowedTypes.includes(fileType.mime)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Only JPG, PNG, and GIF images are allowed",
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = validateImage;