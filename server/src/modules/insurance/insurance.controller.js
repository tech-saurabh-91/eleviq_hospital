const {
    createInsurance: createInsuranceService,
    getMyInsurance: getMyInsuranceService,
} = require("./insurance.service");

const cloudinary = require("../../config/cloudinary");

const uploadToCloudinary = (file, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );

        stream.end(file.buffer);
    });
};

const createInsurance = async (req, res) => {
    try {
        let frontCardImage;
        let backCardImage;

        if (req.files?.frontCardImage?.[0]) {
            frontCardImage = await uploadToCloudinary(
                req.files.frontCardImage[0],
                "insurance-cards"
            );
        }

        if (req.files?.backCardImage?.[0]) {
            backCardImage = await uploadToCloudinary(
                req.files.backCardImage[0],
                "insurance-cards"
            );
        }

        const insuranceData = {
            ...req.body,
            frontCardImage,
            backCardImage,
        };

        const result = await createInsuranceService(
            req.user._id,
            insuranceData
        );

        return res.status(201).json({
            success: true,
            message: "Insurance added successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getMyInsurance = async (req, res) => {
    try {
        const result = await getMyInsuranceService(req.user._id);

        return res.status(200).json({
            success: true,
            message: "Insurance records fetched successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createInsurance,
    getMyInsurance,
};