const Patient = require("../patients/patient.model");
const Insurance = require("./insurance.model");

const createInsurance = async (patientId,insuranceData) => {
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

    const patient = await Patient.findById(patientId);

    if (!patient) {
        throw new Error("Patient not found");
    }

    if (new Date(effectiveDate) > new Date()) {
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

    const insurance = await Insurance.create({
        patient: patient._id,
        insuranceType,
        insuranceProvider,
        insuranceId,
        policyNumber,
        groupNumber,
        ediPayer,
        coverageType,
        effectiveDate: new Date(effectiveDate),
        isPrimary,
        frontCardImage,
        backCardImage,
    });

    return {
        insuranceId: insurance._id,
        patientId: patient.patientId,
        insuranceType: insurance.insuranceType,
        insuranceProvider: insurance.insuranceProvider,
        insuranceIdNumber: insurance.insuranceId,
        policyNumber: insurance.policyNumber,
        groupNumber: insurance.groupNumber,
        ediPayer: insurance.ediPayer,
        coverageType: insurance.coverageType,
        effectiveDate: insurance.effectiveDate,
        isPrimary: insurance.isPrimary,
        frontCardImage: insurance.frontCardImage,
        backCardImage: insurance.backCardImage,
    };
};

const getMyInsurance = async (userId) => {
    const patient = await Patient.findById(userId);

    if (!patient) {
        throw new Error("Patient not found");
    }

    const insuranceRecords = await Insurance.find({
        patient: patient._id,
    }).sort({ isPrimary: -1, createdAt: -1 });

    return insuranceRecords;
};

module.exports = {
    createInsurance,
    getMyInsurance,
};