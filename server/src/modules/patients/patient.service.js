const bcrypt = require("bcrypt");
const crypto = require("crypto");

const PatientEmailChangeOtp = require("./profile/patient-email-change-otp.model");
const { sendEmail } = require("../../services/email.service");

const User = require("../users/user.model");
const Role = require("../roles/role.model");
const Patient = require("./patient.model");
const RegistrationOtp = require("./registration-otp.model");
const Terms = require("../terms/terms.model");

const generateOtp = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

const hashOtp = async (otp) => {
    return bcrypt.hash(otp, 10);
};

const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();

    const monthDifference = today.getMonth() - dob.getMonth();

    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() < dob.getDate()
        )
    ) {
        age--;
    }

    return age;
};

const generatePatientId = () => {
    const year = new Date().getFullYear();

    const randomPart = crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase();

    return `PAT-${year}-${randomPart}`;
};

const startRegistration = async (registrationData) => {
    const {
        termsId,
        termsAccepted,
        termsAcceptedAt,
        registrationType,
        email,
        primaryPhone,
        dateOfBirth,
        password,
    } = registrationData;

    const activeTerms = await Terms.findOne({
        _id: termsId,
        status: "active",
    });

    if (!activeTerms) {
        throw new Error("You must accept the currently active Terms & Conditions");
    }

    if (!termsAccepted) {
        throw new Error("You must accept the Terms & Conditions");
    }

    /*
     * Adult registration:
     * Patient must be 18 years or older.
     */
    if (registrationType === "self") {
        const age = calculateAge(dateOfBirth);

        if (age < 18) {
            throw new Error(
                "Self registration is only available for patients 18 years or older"
            );
        }
    }

    /*
     * Check whether an account already exists.
     */
    const existingUser = await User.findOne({
        $or: [
            { email: email.toLowerCase() },
            { mobile: primaryPhone },
        ],
    });

    if (existingUser) {
        if (
            existingUser.email &&
            existingUser.email === email.toLowerCase()
        ) {
            throw new Error("Email already registered");
        }

        if (
            existingUser.mobile &&
            existingUser.mobile === primaryPhone
        ) {
            throw new Error("Mobile number already registered");
        }
    }

    /*
     * Patient role must already exist.
     */
    const patientRole = await Role.findOne({
        name: "patient",
    });

    if (!patientRole) {
        throw new Error("Patient role not found");
    }

    /*
     * Never store the plaintext password.
     */
    const passwordHash = await bcrypt.hash(password, 12);

    /*
     * Generate OTP.
     */
    const otp = generateOtp();
    const otpHash = await hashOtp(otp);

    /*
     * Remove an older pending registration for the same email.
     */
    await RegistrationOtp.deleteMany({
        email: email.toLowerCase(),
        verified: false,
    });

    /*
     * Store registration information temporarily.
     *
     * Password is stored only as a hash.
     */
    const pendingRegistration = await RegistrationOtp.create({
        email: email.toLowerCase(),

        otpHash,

        registrationData: {
            ...registrationData,

            termsId: activeTerms._id.toString(),
            termsVersion: activeTerms.version,
            termsAccepted: true,
            termsAcceptedAt,

            email: email.toLowerCase(),
            password: undefined,
            passwordHash,
        },

        expiresAt: new Date(
            Date.now() + 10 * 60 * 1000
        ),
    });

    return {
        registrationId: pendingRegistration._id,

        /*
         * QA ONLY
         *
         * The documentation allows the OTP to be
         * displayed temporarily during development/testing.
         *
         * Remove this before production.
         */
        qaOtp: otp,

        expiresAt: pendingRegistration.expiresAt,
    };
};

const verifyRegistrationOtp = async ({
    registrationId,
    otp,
}) => {
    const pendingRegistration =
        await RegistrationOtp.findById(registrationId);

    if (!pendingRegistration) {
        throw new Error(
            "Registration session not found or expired"
        );
    }

    if (pendingRegistration.verified) {
        throw new Error(
            "Registration has already been verified"
        );
    }

    if (
        pendingRegistration.expiresAt.getTime() <
        Date.now()
    ) {
        await RegistrationOtp.findByIdAndDelete(
            registrationId
        );

        throw new Error("OTP has expired");
    }

    /*
     * Prevent unlimited OTP attempts.
     */
    if (pendingRegistration.attempts >= 5) {
        throw new Error(
            "Maximum OTP attempts exceeded"
        );
    }

    const isOtpValid = await bcrypt.compare(
        otp,
        pendingRegistration.otpHash
    );

    if (!isOtpValid) {
        pendingRegistration.attempts += 1;

        await pendingRegistration.save();

        throw new Error("Invalid OTP");
    }

    const registrationData =
        pendingRegistration.registrationData;

    const patientRole = await Role.findOne({
        name: "patient",
    });

    if (!patientRole) {
        throw new Error("Patient role not found");
    }

    /*
     * Create the authentication account.
     */
    const user = await User.create({
        email: registrationData.email,
        mobile: registrationData.primaryPhone,
        passwordHash: registrationData.passwordHash,
        roles: [patientRole._id],
        isVerified: true,
        status: "active",
    });

    /*
     * Generate Patient ID on the backend.
     */
    let patientId;

    let patientIdExists = true;

    while (patientIdExists) {
        patientId = generatePatientId();

        patientIdExists = await Patient.exists({
            patientId,
        });
    }

    /*
     * Create patient healthcare profile.
     */
    const patient = await Patient.create({
        patientId,

        user: user._id,

        registrationType:
            registrationData.registrationType,

        profilePicture:
            registrationData.profilePicture,

        firstName:
            registrationData.firstName,

        middleName:
            registrationData.middleName,

        lastName:
            registrationData.lastName,

        dateOfBirth:
            new Date(registrationData.dateOfBirth),

        gender:
            registrationData.gender,

        primaryPhone:
            registrationData.primaryPhone,

        secondaryPhone:
            registrationData.secondaryPhone,

        address:
            registrationData.address,

        registrationStatus: "active",

        emailVerified: true,
    });

    /*
     * Mark OTP registration as completed.
     */
    pendingRegistration.verified = true;

    await pendingRegistration.save();

    return {
        patientId: patient.patientId,

        userId: user._id,

        email: user.email,

        registrationType:
            patient.registrationType,
    };
};

const getMyProfile = async (patientId) => {
    const patient = await Patient.findById(patientId).populate({
        path: "roles",
        populate: {
            path: "permissions",
        },
    });

    if (!patient) {
        throw new Error("Patient profile not found");
    }

    return {
        patientId: patient.patientId,
        username: patient.username,

        firstName: patient.firstName,
        middleName: patient.middleName,
        lastName: patient.lastName,

        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,

        email: patient.email,
        mobile: patient.mobile,
        primaryPhone: patient.primaryPhone,
        secondaryPhone: patient.secondaryPhone,

        address: patient.address,

        bloodType: patient.bloodType,
        allergies: patient.allergies,

        profilePicture: patient.profilePicture,

        registrationType: patient.registrationType,

        memberSince: patient.createdAt,
        lastUpdated: patient.updatedAt,

        roles: patient.roles?.map((role) => role.name) || [],
    };
};

const updateMyProfile = async (patientId, updateData) => {
    const patient = await Patient.findById(patientId);

    if (!patient) {
        throw new Error("Patient profile not found");
    }

    const allowedFields = [
        "firstName",
        "middleName",
        "lastName",
        "dateOfBirth",
        "gender",
        "secondaryPhone",
        "bloodType",
        "allergies",
    ];

    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            patient[field] = updateData[field];
        }
    }

    if (updateData.address) {
        patient.address = {
            ...patient.address?.toObject?.(),
            ...updateData.address,
        };
    }

    await patient.save();

    return getMyProfile(patientId);
};

const requestEmailChange = async (patientId, newEmail) => {
    const patient = await Patient.findById(patientId);

    if (!patient) {
        throw new Error("Patient profile not found");
    }

    const normalizedEmail = newEmail.trim().toLowerCase();

    if (normalizedEmail === patient.email.toLowerCase()) {
        throw new Error("New email must be different from current email");
    }

    const existingPatient = await Patient.findOne({
        email: normalizedEmail,
        _id: { $ne: patientId },
    });

    if (existingPatient) {
        throw new Error("Email is already registered");
    }

    const existingUser = await User.findOne({
        email: normalizedEmail,
    });

    if (existingUser) {
        throw new Error("Email is already registered");
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otp, 12);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await PatientEmailChangeOtp.findOneAndUpdate(
        { patient: patientId },
        {
            patient: patientId,
            newEmail: normalizedEmail,
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
        to: normalizedEmail,
        subject: "Verify your new email address",
        text: `Your email change verification code is ${otp}. This code expires in 10 minutes.`,
        html: `
            <p>Your email change verification code is:</p>
            <h2>${otp}</h2>
            <p>This code expires in 10 minutes.</p>
        `,
    });

    return {
        message: "Verification OTP sent to the new email address",
        expiresIn: 600,
    };
};

const verifyEmailChange = async (patientId, otp) => {
    const challenge = await PatientEmailChangeOtp.findOne({
        patient: patientId,
    });

    if (!challenge) {
        throw new Error("Email change request not found or expired");
    }

    if (challenge.expiresAt < new Date()) {
        await PatientEmailChangeOtp.deleteOne({
            _id: challenge._id,
        });

        throw new Error("OTP has expired");
    }

    if (challenge.attempts >= 5) {
        await PatientEmailChangeOtp.deleteOne({
            _id: challenge._id,
        });

        throw new Error("Maximum OTP attempts exceeded");
    }

    const isValidOtp = await bcrypt.compare(
        otp,
        challenge.otpHash
    );

    if (!isValidOtp) {
        challenge.attempts += 1;
        await challenge.save();

        throw new Error("Invalid OTP");
    }

    const normalizedEmail = challenge.newEmail;

    const existingPatient = await Patient.findOne({
        email: normalizedEmail,
        _id: { $ne: patientId },
    });

    if (existingPatient) {
        throw new Error("Email is already registered");
    }

    const existingUser = await User.findOne({
        email: normalizedEmail,
    });

    if (existingUser) {
        throw new Error("Email is already registered");
    }

    const patient = await Patient.findById(patientId);

    if (!patient) {
        throw new Error("Patient profile not found");
    }

    patient.email = normalizedEmail;
    patient.emailVerified = true;

    await patient.save();

    await PatientEmailChangeOtp.deleteOne({
        _id: challenge._id,
    });

    return getMyProfile(patientId);
};

module.exports = {
    startRegistration,
    verifyRegistrationOtp,
    getMyProfile,
    updateMyProfile,
    requestEmailChange,
    verifyEmailChange,
};