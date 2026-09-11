const {
    createInsurance: createInsuranceService,
    getMyInsurance: getMyInsuranceService,
    getInsuranceById: getInsuranceByIdService,
    updateInsurance: updateInsuranceService,
    deleteInsurance: deleteInsuranceService,
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
                    resolve({
                        publicId: result.public_id,
                        url: result.secure_url,
                    });
                }
            }
        );

        stream.end(file.buffer);
    });
};

const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
    });
};

const createInsurance = async (req, res) => {
    let uploadedImages = [];

    try {
        // Generate the insurance ID before uploading images.
        const Insurance = require("./insurance.model");
        const insuranceId = new Insurance()._id;

        const folder = `insurance-cards/${req.user.patientId}/${insuranceId}`;

        let frontCardImage;
        let backCardImage;

        if (req.files?.frontCardImage?.[0]) {
            frontCardImage = await uploadToCloudinary(
                req.files.frontCardImage[0],
                folder
            );

            uploadedImages.push(frontCardImage.publicId);
        }

        if (req.files?.backCardImage?.[0]) {
            backCardImage = await uploadToCloudinary(
                req.files.backCardImage[0],
                folder
            );

            uploadedImages.push(backCardImage.publicId);
        }

        const insuranceData = {
            ...req.body,
            insuranceObjectId: insuranceId,
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
        // Remove already-uploaded images if the insurance creation fails.
        for (const publicId of uploadedImages) {
            try {
                await deleteFromCloudinary(publicId);
            } catch (cleanupError) {
                console.error(
                    "Insurance image cleanup failed:",
                    cleanupError.message
                );
            }
        }

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

const getInsuranceById = async (req, res) => {
    try {
        const result = await getInsuranceByIdService(
            req.user._id,
            req.params.insuranceId
        );

        return res.status(200).json({
            success: true,
            message: "Insurance record fetched successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const updateInsurance = async (req, res) => {
    let uploadedImages = [];
    let oldImages = {};

    try {
        const Insurance = require("./insurance.model");

        const existingInsurance = await Insurance.findOne({
            _id: req.params.insuranceId,
            patient: req.user._id,
        });

        if (!existingInsurance) {
            return res.status(404).json({
                success: false,
                message: "Insurance not found",
            });
        }

        oldImages = {
            frontCardImage:
                existingInsurance.frontCardImage,
            backCardImage:
                existingInsurance.backCardImage,
        };

        const folder = `insurance-cards/${req.user.patientId}/${req.params.insuranceId}`;

        const uploadedImagesData = {};

        if (req.files?.frontCardImage?.[0]) {
            uploadedImagesData.frontCardImage =
                await uploadToCloudinary(
                    req.files.frontCardImage[0],
                    folder
                );

            uploadedImages.push(
                uploadedImagesData.frontCardImage.publicId
            );
        }

        if (req.files?.backCardImage?.[0]) {
            uploadedImagesData.backCardImage =
                await uploadToCloudinary(
                    req.files.backCardImage[0],
                    folder
                );

            uploadedImages.push(
                uploadedImagesData.backCardImage.publicId
            );
        }

        const result = await updateInsuranceService(
            req.user._id,
            req.params.insuranceId,
            req.body,
            uploadedImagesData
        );

        // Delete old images only after successful DB update.
        if (
            uploadedImagesData.frontCardImage &&
            oldImages.frontCardImage?.publicId
        ) {
            await deleteFromCloudinary(
                oldImages.frontCardImage.publicId
            );
        }

        if (
            uploadedImagesData.backCardImage &&
            oldImages.backCardImage?.publicId
        ) {
            await deleteFromCloudinary(
                oldImages.backCardImage.publicId
            );
        }

        return res.status(200).json({
            success: true,
            message: "Insurance updated successfully",
            data: result,
        });
    } catch (error) {
        // Clean up newly uploaded images if update fails.
        for (const publicId of uploadedImages) {
            try {
                await deleteFromCloudinary(publicId);
            } catch (cleanupError) {
                console.error(
                    "Insurance image cleanup failed:",
                    cleanupError.message
                );
            }
        }

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteInsurance = async (req, res) => {
    try {
        const result = await deleteInsuranceService(
            req.user._id,
            req.params.insuranceId
        );

        const imagesToDelete = [
            result.deletedImages?.frontCardImage?.publicId,
            result.deletedImages?.backCardImage?.publicId,
        ].filter(Boolean);

        for (const publicId of imagesToDelete) {
            try {
                await deleteFromCloudinary(publicId);
            } catch (cleanupError) {
                console.error(
                    "Insurance image cleanup failed:",
                    cleanupError.message
                );
            }
        }

        return res.status(200).json({
            success: true,
            message: "Insurance deleted successfully",
            data: {
                insuranceId: result.insuranceId,
            },
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
    getInsuranceById,
    updateInsurance,
    deleteInsurance,
};