const Patient = require("../patients/patient.model");
const FamilyMember = require("../patients/family/family-member.model");
const Insurance = require("./insurance.model");

const createInsurance = async (patientId, insuranceData) => {
    const {
        insuranceType,
        insuranceProvider,
        insuranceId,
        policyNumber,
        groupNumber,
        ediPayer,
        coverageType,
        effectiveDate,
        relationship,
        familyMemberId,
        isPrimary,
        subscriberName,
        subscriberCopay,
        subscriberSsn,
        subscriberDateOfBirth,
        subscriberAddress,
        frontCardImage,
        backCardImage,
    } = insuranceData;

    // Verify patient
    const patient = await Patient.findById(patientId);

    if (!patient) {
        throw new Error("Patient not found");
    }

    // Validate effective date
    if (new Date(effectiveDate) > new Date()) {
        throw new Error(
            "Insurance effective date cannot be in the future"
        );
    }

    // Family member is optional.
    // If provided, verify ownership.
    let familyMember = null;

    if (familyMemberId) {
        familyMember = await FamilyMember.findOne({
            _id: familyMemberId,
            patient: patient._id,
            status: "active",
        });

        if (!familyMember) {
            throw new Error("Family member not found");
        }
    }

    // Determine whether this is commercial insurance
    const normalizedInsuranceType =
        insuranceType.toLowerCase();

    const isCommercial =
        normalizedInsuranceType.includes("commercial") ||
        normalizedInsuranceType.includes("non-medicaid");

    // Commercial insurance requires subscriber information
    if (isCommercial) {
        if (!subscriberName) {
            throw new Error("Subscriber name is required");
        }

        if (!subscriberSsn) {
            throw new Error("Subscriber SSN is required");
        }

        if (!subscriberDateOfBirth) {
            throw new Error(
                "Subscriber date of birth is required"
            );
        }

        if (!subscriberAddress) {
            throw new Error(
                "Subscriber address is required"
            );
        }
    }

    // Only one primary insurance per patient account
    if (isPrimary) {
        await Insurance.updateMany(
            {
                patient: patient._id,
                familyMember: familyMember ? familyMember._id : null,
                isPrimary: true,
            },
            {
                $set: { isPrimary: false },
            }
        );
    }

    const insurance = await Insurance.create({
        patient: patient._id,

        familyMember: familyMember
            ? familyMember._id
            : null,

        insuranceType,
        insuranceProvider,
        insuranceId,
        policyNumber,
        groupNumber,
        ediPayer,
        coverageType,

        effectiveDate: new Date(effectiveDate),

        relationship,
        isPrimary,

        subscriberName,
        subscriberCopay,
        subscriberSsn,

        subscriberDateOfBirth:
            subscriberDateOfBirth
                ? new Date(subscriberDateOfBirth)
                : undefined,

        subscriberAddress,

        // Keep Cloudinary URLs
        frontCardImage,
        backCardImage,
    });

    return {
        insuranceId: insurance._id,
        patientId: patient.patientId,
        familyMemberId: familyMember
            ? familyMember._id
            : null,

        insuranceType: insurance.insuranceType,
        insuranceProvider: insurance.insuranceProvider,
        insuranceIdNumber: insurance.insuranceId,
        policyNumber: insurance.policyNumber,
        groupNumber: insurance.groupNumber,
        ediPayer: insurance.ediPayer,
        coverageType: insurance.coverageType,

        effectiveDate: insurance.effectiveDate,
        relationship: insurance.relationship,
        isPrimary: insurance.isPrimary,

        subscriberName: insurance.subscriberName,
        subscriberCopay: insurance.subscriberCopay,
        subscriberDateOfBirth:
            insurance.subscriberDateOfBirth,
        subscriberAddress:
            insurance.subscriberAddress,

        frontCardImage: insurance.frontCardImage,
        backCardImage: insurance.backCardImage,

        createdAt: insurance.createdAt,
        updatedAt: insurance.updatedAt,
    };
};


const getMyInsurance = async (userId) => {
    const patient = await Patient.findById(userId);

    if (!patient) {
        throw new Error("Patient not found");
    }

    const insuranceRecords = await Insurance.find({
        patient: patient._id,
    })
        .populate(
            "familyMember",
            "firstName middleName lastName relationship"
        )
        .select("-subscriberSsn")
        .sort({
            isPrimary: -1,
            createdAt: -1,
        });

    return insuranceRecords;
};


module.exports = {
    createInsurance,
    getMyInsurance,
};