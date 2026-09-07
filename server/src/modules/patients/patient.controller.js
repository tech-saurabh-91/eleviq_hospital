const patientService = require("./patient.service");
const {
    startRegistration: startRegistrationService,
} = require("./patient.service");

const {
    createRegistrationSession: createRegistrationSessionService,
    completePrerequisites: completePrerequisitesService,
    completeAgeVerification: completeAgeVerificationService,
    saveAccountInformation: saveAccountInformationService,
    completeVerificationMethod: completeVerificationMethodService,
    verifyRegistrationOtp: verifyRegistrationOtpService,
    resendRegistrationOtp: resendRegistrationOtpService,
} = require("./patient-registration.service");

const startRegistration = async (req, res) => {
    try {
        const result = await startRegistrationService(req.body);

        return res.status(201).json({
            success: true,
            message: "Registration started successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const completePrerequisites = async (req, res) => {
    try {
        const result =
            await completePrerequisitesService(
                req.body.registrationId
            );

        return res.status(200).json({
            success: true,
            message: "Prerequisites completed successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const completeAgeVerification = async (req, res) => {
    try {
        const result =
            await completeAgeVerificationService(
                req.body.registrationId,
                req.body.selection
            );

        return res.status(200).json({
            success: true,
            message:
                "Age verification completed successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const saveAccountInformation = async (req, res) => {
    try {
        const {
            registrationId,
            ...accountData
        } = req.body;
        console.log("Profile picture received:", req.file);

        const result =
            await saveAccountInformationService(
                registrationId,
                accountData,
                req.file
            );

        return res.status(200).json({
            success: true,
            message:
                "Account information saved successfully",
            data: result,
        });
    } catch (error) {
    console.error("FULL CLOUDINARY ERROR:");
    console.dir(error, { depth: null });

    return res.status(400).json({
        success: false,
        message: error.message,
    });
}
};

const completeVerificationMethod = async (req, res) => {
    try {
        const result =
            await completeVerificationMethodService(
                req.body.registrationId,
                req.body.method
            );

        return res.status(200).json({
            success: true,
            message:
                "Verification method selected successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}; 

const verifyRegistrationOtp = async (req, res) => {
    try {
        const {
            registrationId,
            otp,
        } = req.body;

        const result =
            await verifyRegistrationOtpService(
                registrationId,
                otp
            );

        return res.status(200).json({
            success: true,
            message:
                "Email verified successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const resendRegistrationOtp = async (req, res) => {
    try {
        const result = await resendRegistrationOtpService(
            req.body.registrationId
        );

        return res.status(200).json({
            success: true,
            message: "OTP resent successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const createRegistrationSession = async (req, res) => {
    try {
        const result =
            await createRegistrationSessionService(req.body);

        return res.status(201).json({
            success: true,
            message: "Registration session created successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const patient = await patientService.getMyProfile(
            req.user._id
        );

        return res.status(200).json({
            success: true,
            message: "Patient profile fetched successfully",
            data: patient,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createRegistrationSession,
    completePrerequisites,
    completeAgeVerification,
    saveAccountInformation,
    completeVerificationMethod,
    verifyRegistrationOtp,
    resendRegistrationOtp,
    startRegistration,
    getMyProfile,
};