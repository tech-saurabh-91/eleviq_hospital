const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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

    if(!activeTerms){
        throw new Error("You must accept the currently active Terms & Conditions");
    }

    if(!termsAccepted){
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

    return patient;
};

module.exports = {
    startRegistration,
    verifyRegistrationOtp,
    getMyProfile,
};