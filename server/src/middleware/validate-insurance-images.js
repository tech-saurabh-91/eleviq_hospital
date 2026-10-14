const validateInsuranceImages = async (req, res, next) => {
    try {
        if (!req.files) {
            return next();
        }

        const { fileTypeFromBuffer } = await import("file-type");

        const allowedCardTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
        ];

        const allowedDocumentTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "application/pdf",
        ];

        if (req.files.frontCardImage) {
            for (const file of req.files.frontCardImage) {
                const fileType = await fileTypeFromBuffer(file.buffer);
                if (!fileType || !allowedCardTypes.includes(fileType.mime)) {
                    return res.status(400).json({
                        success: false,
                        message: "Only JPG, PNG, and GIF images are allowed for insurance cards",
                    });
                }
            }
        }

        if (req.files.backCardImage) {
            for (const file of req.files.backCardImage) {
                const fileType = await fileTypeFromBuffer(file.buffer);
                if (!fileType || !allowedCardTypes.includes(fileType.mime)) {
                    return res.status(400).json({
                        success: false,
                        message: "Only JPG, PNG, and GIF images are allowed for insurance cards",
                    });
                }
            }
        }

        if (req.files.policyDocument) {
            for (const file of req.files.policyDocument) {
                const fileType = await fileTypeFromBuffer(file.buffer);
                if (!fileType || !allowedDocumentTypes.includes(fileType.mime)) {
                    return res.status(400).json({
                        success: false,
                        message: "Policy document must be a PDF, JPG, PNG, or GIF file",
                    });
                }
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = validateInsuranceImages;