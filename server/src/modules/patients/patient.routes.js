const express = require("express");

const validate = require("../../middleware/validate");

const authenticate = require("../../middleware/auth");
const authorize = require("../../middleware/authorize");
const upload = require("../../middleware/upload");
const { uploadImage, deleteImage } = require("../../services/media.service");
const validateImage = require("../../middleware/validate-image");
const parseRegistrationForm = require("../../middleware/parse-registration-form");

const {
    verifyRegistrationOtpSchema,
    createRegistrationSessionSchema,
    completePrerequisitesSchema,
    completeAgeVerificationSchema,
    accountInformationSchema,
    completeVerificationMethodSchema,
    resendRegistrationOtpSchema,
} = require("./patient.validation");

const {
    getMyProfile,
    createRegistrationSession,
    completePrerequisites,
    completeAgeVerification,
    saveAccountInformation,
    completeVerificationMethod,
    verifyRegistrationOtp,
    resendRegistrationOtp,
} = require("./patient.controller");

const router = express.Router();

router.post(
    "/registration/session",
    validate(createRegistrationSessionSchema),
    createRegistrationSession
);

router.post(
    "/registration/prerequisites/complete",
    validate(completePrerequisitesSchema),
    completePrerequisites
);

router.post(
    "/registration/age-verification/complete",
    validate(completeAgeVerificationSchema),
    completeAgeVerification
);

router.post(
    "/registration/account",
    upload.single("profilePicture"),
    validateImage,
    parseRegistrationForm,
    validate(accountInformationSchema),
    saveAccountInformation
);

router.post(
    "/profile-picture",
    authenticate,
    authorize("patient.self.profile.update"),
    upload.single("profilePicture"),
    async (req, res) => {
        let uploadedImage = null;

        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Profile picture is required",
                });
            }

            const folder = `eleviq-hospital/patients/${req.user.patientId}/profile`;

            uploadedImage = await uploadImage(
                req.file,
                folder
            );

            const oldPublicId = req.user.profilePicture?.publicId;

            req.user.profilePicture = {
                publicId: uploadedImage.publicId,
                url: uploadedImage.url,
            };

            await req.user.save();

            if (oldPublicId) {
                await deleteImage(oldPublicId);
            }

            res.status(200).json({
                success: true,
                message: "Profile picture uploaded successfully",
                data: req.user.profilePicture,
            });
        } catch (error) {
            if (uploadedImage?.publicId) {
                try {
                    await deleteImage(uploadedImage.publicId);
                } catch (cleanupError) {
                    console.error(
                        "Cloudinary cleanup failed:",
                        cleanupError.message
                    );
                }
            }

            console.error(
                "Profile picture upload error:",
                error
            );

            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
);

router.post(
    "/registration/verification-method",
    validate(completeVerificationMethodSchema),
    completeVerificationMethod
);

router.post(
    "/registration/verify-otp",
    validate(verifyRegistrationOtpSchema),
    verifyRegistrationOtp
);

router.post(
    "/registration/resend-otp",
    validate(resendRegistrationOtpSchema),
    resendRegistrationOtp
);

router.get(
    "/me",
    authenticate,
    authorize("patient.self.read"),
    getMyProfile
);

module.exports = router;