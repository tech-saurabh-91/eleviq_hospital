const Patient = require("../patients/patient.model");
const FamilyMember = require("../patients/family/family-member.model");
const Insurance = require("./insurance.model");

const createInsurance = async (patientId, insuranceData) => {
    const {
        insuranceObjectId,
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
        policyDocument,
        // Indian HMS Insurance Fields
        tpa,
        planName,
        policyType,
        policyHolderName,
        expiryDate,
        sumInsured,
        remainingSumInsured,
        roomRentLimit,
        copay,
        deductible,
        coverageRestrictions,
        employerName,
        employeeId,
        schemeName,
        beneficiaryId,
        verificationStatus,
        verificationRemarks,
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

    // Validate expiry date if provided
    if (expiryDate && new Date(expiryDate) < new Date(effectiveDate)) {
        throw new Error(
            "Policy expiry date cannot be earlier than effective date"
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

    // Check for legacy US commercial insurance where SSN was required
    const normalizedInsuranceType = (insuranceType || "").toLowerCase();
    const isLegacyUsCommercial =
        normalizedInsuranceType === "non-medicaid" ||
        (normalizedInsuranceType === "commercial" && Boolean(subscriberSsn));

    if (isLegacyUsCommercial) {
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

    // Only one primary insurance per patient account/family member
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

    const insurance = new Insurance({
        _id: insuranceObjectId,
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

        subscriberName: subscriberName || policyHolderName,
        subscriberCopay: subscriberCopay || copay,
        subscriberSsn,

        subscriberDateOfBirth:
            subscriberDateOfBirth
                ? new Date(subscriberDateOfBirth)
                : undefined,

        subscriberAddress,

        // Indian HMS Fields
        tpa,
        planName,
        policyType: policyType || "Individual",
        policyHolderName: policyHolderName || subscriberName,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        sumInsured: sumInsured !== undefined ? Number(sumInsured) : undefined,
        remainingSumInsured: remainingSumInsured !== undefined ? Number(remainingSumInsured) : undefined,
        roomRentLimit,
        copay: copay || subscriberCopay,
        deductible,
        coverageRestrictions,
        employerName,
        employeeId,
        schemeName,
        beneficiaryId,

        // Verification metadata
        verificationStatus: verificationStatus || "Pending",
        verificationRemarks: verificationRemarks || "",

        // Store Cloudinary image/document metadata
        frontCardImage,
        backCardImage,
        policyDocument,
    });

    await insurance.save();

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

        // Indian HMS Fields
        tpa: insurance.tpa,
        planName: insurance.planName,
        policyType: insurance.policyType,
        policyHolderName: insurance.policyHolderName,
        expiryDate: insurance.expiryDate,
        sumInsured: insurance.sumInsured,
        remainingSumInsured: insurance.remainingSumInsured,
        roomRentLimit: insurance.roomRentLimit,
        copay: insurance.copay,
        deductible: insurance.deductible,
        coverageRestrictions: insurance.coverageRestrictions,
        employerName: insurance.employerName,
        employeeId: insurance.employeeId,
        schemeName: insurance.schemeName,
        beneficiaryId: insurance.beneficiaryId,
        verificationStatus: insurance.verificationStatus,
        verificationRemarks: insurance.verificationRemarks,

        frontCardImage: insurance.frontCardImage,
        backCardImage: insurance.backCardImage,
        policyDocument: insurance.policyDocument,

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

const getInsuranceById = async (patientId, insuranceId) => {
    const patient = await Patient.findById(patientId);

    if (!patient) {
        throw new Error("Patient not found");
    }

    const insurance = await Insurance.findOne({
        _id: insuranceId,
        patient: patient._id,
    })
        .populate(
            "familyMember",
            "firstName middleName lastName relationship"
        )
        .select("-subscriberSsn");

    if (!insurance) {
        throw new Error("Insurance not found");
    }

    return insurance;
};

const updateInsurance = async (
    patientId,
    insuranceId,
    updateData,
    uploadedImages
) => {
    const patient = await Patient.findById(patientId);

    if (!patient) {
        throw new Error("Patient not found");
    }

    const insurance = await Insurance.findOne({
        _id: insuranceId,
        patient: patient._id,
    });

    if (!insurance) {
        throw new Error("Insurance not found");
    }

    if (
        updateData.effectiveDate &&
        new Date(updateData.effectiveDate) > new Date()
    ) {
        throw new Error(
            "Insurance effective date cannot be in the future"
        );
    }

    let familyMember = null;

    if (updateData.familyMemberId) {
        familyMember = await FamilyMember.findOne({
            _id: updateData.familyMemberId,
            patient: patient._id,
            status: "active",
        });

        if (!familyMember) {
            throw new Error("Family member not found");
        }

        insurance.familyMember = familyMember._id;
    }

    const allowedFields = [
        "insuranceType",
        "insuranceProvider",
        "insuranceId",
        "policyNumber",
        "groupNumber",
        "ediPayer",
        "coverageType",
        "relationship",
        "subscriberName",
        "subscriberCopay",
        "subscriberSsn",
        "subscriberAddress",
        // Indian HMS Fields
        "tpa",
        "planName",
        "policyType",
        "policyHolderName",
        "sumInsured",
        "remainingSumInsured",
        "roomRentLimit",
        "copay",
        "deductible",
        "coverageRestrictions",
        "employerName",
        "employeeId",
        "schemeName",
        "beneficiaryId",
        "verificationStatus",
        "verificationRemarks",
    ];

    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            insurance[field] = updateData[field];
        }
    }

    if (updateData.effectiveDate) {
        insurance.effectiveDate = new Date(
            updateData.effectiveDate
        );
    }

    if (updateData.expiryDate) {
        const effDate = updateData.effectiveDate ? new Date(updateData.effectiveDate) : insurance.effectiveDate;
        if (new Date(updateData.expiryDate) < new Date(effDate)) {
            throw new Error(
                "Policy expiry date cannot be earlier than effective date"
            );
        }
        insurance.expiryDate = new Date(updateData.expiryDate);
    }

    if (updateData.isPrimary !== undefined) {
        if (updateData.isPrimary) {
            await Insurance.updateMany(
                {
                    patient: patient._id,
                    familyMember: insurance.familyMember,
                    _id: { $ne: insurance._id },
                    isPrimary: true,
                },
                {
                    $set: { isPrimary: false },
                }
            );
        }

        insurance.isPrimary = updateData.isPrimary;
    }

    if (uploadedImages?.frontCardImage) {
        insurance.frontCardImage =
            uploadedImages.frontCardImage;
    }

    if (uploadedImages?.backCardImage) {
        insurance.backCardImage =
            uploadedImages.backCardImage;
    }

    if (uploadedImages?.policyDocument) {
        insurance.policyDocument =
            uploadedImages.policyDocument;
    }

    await insurance.save();

    return insurance;
};

const deleteInsurance = async (patientId, insuranceId) => {
    const patient = await Patient.findById(patientId);

    if (!patient) {
        throw new Error("Patient not found");
    }

    const insurance = await Insurance.findOne({
        _id: insuranceId,
        patient: patient._id,
    });

    if (!insurance) {
        throw new Error("Insurance not found");
    }

    const deletedImages = {
        frontCardImage: insurance.frontCardImage,
        backCardImage: insurance.backCardImage,
        policyDocument: insurance.policyDocument,
    };

    await Insurance.deleteOne({
        _id: insurance._id,
        patient: patient._id,
    });

    return {
        insuranceId: insurance._id,
        deletedImages,
    };
};
module.exports = {
    createInsurance,
    getMyInsurance,
    getInsuranceById,
    updateInsurance,
    deleteInsurance,
};