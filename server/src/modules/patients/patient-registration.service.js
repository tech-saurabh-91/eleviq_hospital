const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const Terms = require("../terms/terms.model");
const PatientRegistration = require("./patient-registration.model");
const PatientRegistrationOtp = require("./patient-registration-otp.model");

const Role = require("../roles/role.model");
const Patient = require("./patient.model");
const Insurance = require("../insurance/insurance.model");
const User = require("../users/user.model");

const {
    uploadImage,
    deleteImage,
} = require("../../services/media.service");

const { sendEmail } = require("../../services/email.service");

const generateOtp = () => {
    return crypto
        .randomInt(100000, 1000000)
        .toString();
};

const generatePatientId = () => {
    const year = new Date().getFullYear();

    const randomPart = crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase();

    return `PAT-${year}-${randomPart}`;
};

const createRegistrationSession = async ({
    termsId,
    termsAccepted,
}) => {
    if (!termsAccepted) {
        throw new Error(
            "You must accept the Terms & Conditions"
        );
    }

    const activeTerms = await Terms.findOne({
        _id: termsId,
        status: "active",
    });

    if (!activeTerms) {
        throw new Error(
            "You must accept the currently active Terms & Conditions"
        );
    }

    const registration = await PatientRegistration.create({
        registrationStatus: "in_progress",

        terms: {
            termsId: activeTerms._id,
            termsVersion: activeTerms.version,
            accepted: true,
            acceptedAt: new Date(),
        },
    });

    return {
        registrationId: registration._id,
        terms: registration.terms,
    };
};

const completePrerequisites = async (registrationId) => {
    const registration = await PatientRegistration.findById(
        registrationId
    );

    if (!registration) {
        throw new Error("Registration session not found");
    }

    if (registration.registrationStatus !== "in_progress") {
        throw new Error("Registration session is no longer active");
    }

    registration.prerequisites.completed = true;
    registration.prerequisites.completedAt = new Date();

    await registration.save();

    return {
        registrationId: registration._id,
        prerequisites: registration.prerequisites,
    };
};

const completeAgeVerification = async (
    registrationId,
    selection
) => {
    const registration =
        await PatientRegistration.findById(registrationId);

    if (!registration) {
        throw new Error("Registration session not found");
    }

    if (
        registration.registrationStatus !==
        "in_progress"
    ) {
        throw new Error(
            "Registration session is no longer active"
        );
    }

    registration.ageVerification.selection =
        selection;

    registration.ageVerification.completed = true;

    registration.ageVerification.completedAt =
        new Date();

    registration.registrationType =
        selection === "adult"
            ? "self"
            : "guardian";

    await registration.save();

    return {
        registrationId: registration._id,
        ageVerification:
            registration.ageVerification,
        registrationType:
            registration.registrationType,
    };
};

const saveAccountInformation = async (
    registrationId,
    accountData,
    profilePictureFile
) => {
    const registration =
        await PatientRegistration.findById(registrationId);

    if (!registration) {
        throw new Error("Registration session not found");
    }

    if (
        registration.registrationStatus !==
        "in_progress"
    ) {
        throw new Error(
            "Registration session is no longer active"
        );
    }

    if (
        !registration.terms.accepted
    ) {
        throw new Error(
            "Terms & Conditions must be accepted first"
        );
    }

    if (
        !registration.prerequisites.completed
    ) {
        throw new Error(
            "Prerequisites must be completed first"
        );
    }

    if (
        !registration.ageVerification.completed
    ) {
        throw new Error(
            "Age verification must be completed first"
        );
    }

    if (
        registration.registrationType !==
        accountData.registrationType
    ) {
        throw new Error(
            "Registration type does not match age verification"
        );
    }

    const passwordHash =
        await bcrypt.hash(
            accountData.password,
            12
        );

    let uploadedProfilePicture = null;

    if (profilePictureFile) {
        uploadedProfilePicture = await uploadImage(
            profilePictureFile,
            `eleviq-hospital/registrations/${registration._id}/profile`
        );
    }

    registration.account = {

        username:
            accountData.username.toLowerCase(),

        email:
            accountData.email.toLowerCase(),

        passwordHash,

        firstName:
            accountData.firstName,

        middleName:
            accountData.middleName,

        lastName:
            accountData.lastName,

        dateOfBirth:
            accountData.dateOfBirth,

        gender:
            accountData.gender,

        primaryPhone:
            accountData.primaryPhone,

        secondaryPhone:
            accountData.secondaryPhone,

        address: {
            street:
                accountData.address.street,

            city:
                accountData.address.city,

            state:
                accountData.address.state,

            zipCode:
                accountData.address.zipCode,
        },

        confirmationAccepted:
            accountData.confirmationAccepted,
    };

    if (uploadedProfilePicture) {
        registration.account.profilePicture = {
            publicId: uploadedProfilePicture.publicId,
            url: uploadedProfilePicture.url,
        };
    }

    try {
        await registration.save();
    } catch (error) {
        if (uploadedProfilePicture?.publicId) {
            try {
                await deleteImage(
                    uploadedProfilePicture.publicId
                );
            } catch (cleanupError) {
                console.error(
                    "Cloudinary cleanup failed:",
                    cleanupError.message
                );
            }
        }

        throw error;
    }

    return {
        registrationId: registration._id,
        registrationType:
            registration.registrationType,

        account: {
            profilePicture:
                registration.account.profilePicture,

            username:
                registration.account.username,

            email:
                registration.account.email,

            firstName:
                registration.account.firstName,

            middleName:
                registration.account.middleName,

            lastName:
                registration.account.lastName,

            dateOfBirth:
                registration.account.dateOfBirth,

            gender:
                registration.account.gender,

            primaryPhone:
                registration.account.primaryPhone,

            secondaryPhone:
                registration.account.secondaryPhone,

            address:
                registration.account.address,

            confirmationAccepted:
                registration.account.confirmationAccepted,
        },
    };
};

const completeVerificationMethod = async (
    registrationId,
    method
) => {
    const registration =
        await PatientRegistration.findById(
            registrationId
        );

    if (!registration) {
        throw new Error(
            "Registration session not found"
        );
    }

    if (
        registration.registrationStatus !==
        "in_progress"
    ) {
        throw new Error(
            "Registration session is no longer active"
        );
    }

    if (
        !registration.ageVerification.completed
    ) {
        throw new Error(
            "Age verification must be completed first"
        );
    }

    if (
        !registration.account.email
    ) {
        throw new Error(
            "Account email is required before verification"
        );
    }

    if (
        !registration.account.passwordHash
    ) {
        throw new Error(
            "Account information must be completed first"
        );
    }

    registration.verification.method = method;
    registration.verification.emailVerified = false;

    const otp = generateOtp();

    const otpHash = await bcrypt.hash(
        otp,
        10
    );

    const expiresAt = new Date(
        Date.now() + 10 * 60 * 1000
    );

    await PatientRegistrationOtp.findOneAndUpdate(
        {
            registrationId: registration._id,
        },
        {
            registrationId: registration._id,
            email: registration.account.email,
            otpHash,
            expiresAt,
            attempts: 0,
        },
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        }
    );

    await registration.save();

    await sendEmail({
        to: registration.account.email,
        subject: "HMS Email Verification OTP",
        text:
            `Your HMS verification OTP is ${otp}. ` +
            `This OTP will expire in 10 minutes.`,

        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>HMS Email Verification</h2>

                <p>
                    Your verification OTP is:
                </p>

                <h1>${otp}</h1>

                <p>
                    This OTP will expire in
                    <strong>10 minutes</strong>.
                </p>

                <p>
                    If you did not request this,
                    please ignore this email.
                </p>
            </div>
        `,
    });

    return {
        registrationId: registration._id,
        verification: {
            method: registration.verification.method,
            emailVerified:
                registration.verification.emailVerified,
        },
        expiresAt,
    };
};

const resendRegistrationOtp = async (registrationId) => {
    const registration = await PatientRegistration.findById(registrationId);

    if (!registration) {
        throw new Error("Registration session not found");
    }

    if (registration.registrationStatus !== "in_progress") {
        throw new Error("Registration session is no longer active");
    }

    if (!registration.account.email) {
        throw new Error("Account email is required before resending OTP");
    }

    const otp = generateOtp();

    const otpHash = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await PatientRegistrationOtp.findOneAndUpdate(
        { registrationId: registration._id },
        {
            registrationId: registration._id,
            email: registration.account.email,
            otpHash,
            expiresAt,
            attempts: 0,
        },
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        }
    );

    await sendEmail({
        to: registration.account.email,
        subject: "HMS Email Verification OTP",
        text:
            `Your new HMS verification OTP is ${otp}. ` +
            `This OTP will expire in 10 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>HMS Email Verification</h2>
                <p>Your new verification OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP will expire in <strong>10 minutes</strong>.</p>
            </div>
        `,
    });

    return {
        registrationId: registration._id,
        expiresAt,
    };
};

const verifyRegistrationOtp = async (
    registrationId,
    otp
) => {
    const registration =
        await PatientRegistration.findById(
            registrationId
        );

    if (!registration) {
        throw new Error(
            "Registration session not found"
        );
    }

    if (
        registration.registrationStatus !==
        "in_progress"
    ) {
        throw new Error(
            "Registration session is no longer active"
        );
    }

    if (
        registration.verification.method !== "email"
    ) {
        throw new Error(
            "Email verification method was not selected"
        );
    }

    if (
        registration.verification.emailVerified
    ) {
        throw new Error(
            "Email has already been verified"
        );
    }



    const otpRecord =
        await PatientRegistrationOtp.findOne({
            registrationId: registration._id,
        });

    if (!otpRecord) {
        throw new Error(
            "OTP not found or expired"
        );
    }

    if (
        otpRecord.expiresAt.getTime() <
        Date.now()
    ) {
        await PatientRegistrationOtp.deleteOne({
            _id: otpRecord._id,
        });

        throw new Error("OTP has expired");
    }

    if (otpRecord.attempts >= 5) {
        throw new Error(
            "Maximum OTP attempts exceeded"
        );
    }

    const isOtpValid =
        await bcrypt.compare(
            otp,
            otpRecord.otpHash
        );

    if (!isOtpValid) {
        otpRecord.attempts += 1;

        await otpRecord.save();

        throw new Error("Invalid OTP");
    }

    const account = registration.account;

    if (
        !account.username ||
        !account.email ||
        !account.passwordHash ||
        !account.firstName ||
        !account.lastName ||
        !account.dateOfBirth ||
        !account.gender ||
        !account.primaryPhone ||
        !account.confirmationAccepted
    ) {
        throw new Error(
            "Complete account information is required before verification"
        );
    }

    const existingPatient = await Patient.findOne({
        $or: [
            { email: account.email },
            { mobile: account.primaryPhone },
            { username: account.username },
        ],
    });

    const existingUser = await User.findOne({
        $or: [
            { email: account.email },
            { mobile: account.primaryPhone },
            { username: account.username },
        ],
    });

    if (existingPatient || existingUser) {
        const existingAccount =
            existingPatient || existingUser;

        if (existingAccount.email === account.email) {
            throw new Error("Email already registered");
        }

        if (existingAccount.mobile === account.primaryPhone) {
            throw new Error("Mobile number already registered");
        }

        if (existingAccount.username === account.username) {
            throw new Error("Username already registered");
        }
    }

    const patientRole = await Role.findOne({
        name: "patient",
    });

    if (!patientRole) {
        throw new Error(
            "Patient role not found"
        );
    }

    const session =
        await mongoose.startSession();

    try {
        let createdPatient;

        await session.withTransaction(
            async () => {

                let patientId;
                let patientIdExists = true;

                while (patientIdExists) {
                    patientId =
                        generatePatientId();

                    patientIdExists =
                        await Patient.exists({
                            patientId,
                        });
                }

                const patients =
                    await Patient.create(
                        [
                            {
                                patientId,

                                username:
                                    account.username,

                                email:
                                    account.email,

                                mobile:
                                    account.primaryPhone,

                                passwordHash:
                                    account.passwordHash,

                                roles: [
                                    patientRole._id,
                                ],

                                isVerified:
                                    true,

                                status:
                                    "active",

                                registrationType: registration.registrationType,

                                profilePicture:
                                    account.profilePicture,

                                firstName:
                                    account.firstName,

                                middleName:
                                    account.middleName,

                                lastName:
                                    account.lastName,

                                dateOfBirth:
                                    account.dateOfBirth,

                                gender:
                                    account.gender,

                                primaryPhone:
                                    account.primaryPhone,

                                secondaryPhone:
                                    account.secondaryPhone,

                                address:
                                    account.address,

                                registrationStatus:
                                    "active",

                                emailVerified:
                                    true,
                            },
                        ],
                        { session }
                    );

                createdPatient =
                    patients[0];

                registration.patient = createdPatient._id;

                registration.verification.emailVerified =
                    true;

                registration.verification.verifiedAt =
                    new Date();

                registration.registrationStatus =
                    "completed";

                await registration.save({
                    session,
                });

                await PatientRegistrationOtp.deleteOne(
                    {
                        _id: otpRecord._id,
                    },
                    {
                        session,
                    }
                );
            }
        );

        return {
            registrationId:
                registration._id,

            registrationStatus:
                registration.registrationStatus,

            verification: {
                method:
                    registration.verification.method,

                emailVerified:
                    registration.verification.emailVerified,

                verifiedAt:
                    registration.verification.verifiedAt,
            },

            patient: {
                patientId: createdPatient.patientId,
                username: createdPatient.username,
                email: createdPatient.email,
                mobile: createdPatient.mobile,
                firstName: createdPatient.firstName,
                lastName: createdPatient.lastName,
                role: "patient",
            },
        };
    } finally {
        await session.endSession();
    }
};

const createRegistrationInsurance = async (
    registrationId,
    insuranceData
) => {

    const registration =
        await PatientRegistration.findById(
            registrationId
        );

    if (!registration) {
        throw new Error(
            "Registration session not found"
        );
    }

    if (
        registration.registrationStatus !==
        "completed"
    ) {
        throw new Error(
            "Registration must be completed before adding insurance"
        );
    }

    if (
        !registration.verification.emailVerified
    ) {
        throw new Error(
            "Email verification is required before adding insurance"
        );
    }

    if (!registration.patient) {
        throw new Error(
            "Patient account was not found for this registration"
        );
    }

    const patient =
        await Patient.findById(
            registration.patient
        );

    if (!patient) {
        throw new Error(
            "Patient not found"
        );
    }

    const {
        insuranceType,
        insuranceProvider,
        insuranceId,
        policyNumber,
        groupNumber,
        ediPayer,
        coverageType,
        effectiveDate,
        isPrimary,
        frontCardImage,
        backCardImage,
    } = insuranceData;

    if (
        new Date(effectiveDate) >
        new Date()
    ) {
        throw new Error(
            "Insurance effective date cannot be in the future"
        );
    }

    if (isPrimary) {
        await Insurance.updateMany(
            {
                patient: patient._id,
                isPrimary: true,
            },
            {
                $set: {
                    isPrimary: false,
                },
            }
        );
    }

    const relationship =
        registration.registrationType === "self"
            ? "Self"
            : "Guardian";

    const insurance =

        await Insurance.create({
            patient: patient._id,

            insuranceType,

            insuranceProvider,

            insuranceId,

            policyNumber,

            groupNumber,

            ediPayer,

            coverageType,

            effectiveDate:
                new Date(effectiveDate),

            relationship,

            isPrimary,

            frontCardImage,

            backCardImage,
        });

    return {
        insuranceId: insurance._id,

        patientId: patient.patientId,

        insuranceType:
            insurance.insuranceType,

        insuranceProvider:
            insurance.insuranceProvider,

        insuranceIdNumber:
            insurance.insuranceId,

        policyNumber:
            insurance.policyNumber,

        groupNumber:
            insurance.groupNumber,

        ediPayer:
            insurance.ediPayer,

        coverageType:
            insurance.coverageType,

        effectiveDate:
            insurance.effectiveDate,

        isPrimary:
            insurance.isPrimary,

        frontCardImage:
            insurance.frontCardImage,

        backCardImage:
            insurance.backCardImage,
    };
};

module.exports = {
    createRegistrationSession,
    completePrerequisites,
    completeAgeVerification,
    saveAccountInformation,
    completeVerificationMethod,
    verifyRegistrationOtp,
    resendRegistrationOtp,
    createRegistrationInsurance,
};