const {
    createRegistrationInsurance: createRegistrationInsuranceService,
} = require("./patient-registration.service");

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
        console.error("CLOUDINARY UPLOAD ERROR:", error);
        reject(error);
    } else {
        console.log("CLOUDINARY UPLOAD SUCCESS:", result);
        resolve(result.secure_url);
    }
}
        );

        stream.end(file.buffer);
    });
};

const createRegistrationInsurance = async (req, res) => {
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

        const registrationId = req.params.registrationId;

        const result = await createRegistrationInsuranceService(
            registrationId,
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

module.exports = {
    createRegistrationInsurance,
};