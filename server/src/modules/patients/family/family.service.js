const FamilyMember = require("./family-member.model");
const Patient = require("../patient.model");

const buildFamilyMemberResponse = (member) => {
    return {
        familyMemberId: member._id,

        firstName: member.firstName,
        middleName: member.middleName,
        lastName: member.lastName,

        relationship: member.relationship,

        dateOfBirth: member.dateOfBirth,
        gender: member.gender,

        email: member.email,
        phone: member.phone,

        address: member.address,

        profilePicture: member.profilePicture,

        status: member.status,

        insuranceCoverage: member.insuranceCoverage,

        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
    };
};

const createFamilyMember = async (
    patientId,
    familyData,
    uploadedImage
) => {
    // Fetch authenticated patient from database to inherit contact and address details
    const patient = await Patient.findById(patientId);

    if (!patient) {
        throw new Error("Patient not found");
    }

    const patientEmail = patient.email?.trim();
    const patientPhone = (patient.primaryPhone || patient.mobile)?.trim();
    const patientStreet = patient.address?.street?.trim();
    const patientCity = patient.address?.city?.trim();
    const patientState = patient.address?.state?.trim();
    const patientZipCode = patient.address?.zipCode?.trim();

    if (
        !patientEmail ||
        !patientPhone ||
        !patientStreet ||
        !patientCity ||
        !patientState ||
        !patientZipCode
    ) {
        throw new Error(
            "Patient profile is incomplete. Please complete your email, phone number, and address in your profile before adding family members."
        );
    }

    // Contact and address details are strictly inherited from the registered patient
    // Client-submitted contact/address values are never trusted during creation
    const familyMember = await FamilyMember.create({
        patient: patientId,

        firstName: familyData.firstName,
        middleName: familyData.middleName,
        lastName: familyData.lastName,

        relationship: familyData.relationship,

        dateOfBirth: familyData.dateOfBirth,

        gender: familyData.gender,

        email: patientEmail.toLowerCase(),
        phone: patientPhone,

        address: {
            street: patientStreet,
            city: patientCity,
            state: patientState,
            zipCode: patientZipCode,
        },

        insuranceCoverage:
            familyData.insuranceCoverage || "patient",

        profilePicture: uploadedImage
            ? {
                publicId: uploadedImage.publicId,
                url: uploadedImage.url,
            }
            : undefined,
    });

    return buildFamilyMemberResponse(familyMember);
};

const getFamilyMembers = async (patientId) => {
    const familyMembers = await FamilyMember.find({
        patient: patientId,
        status: "active",
    }).sort({
        createdAt: -1,
    });

    return familyMembers.map(buildFamilyMemberResponse);
};

const getFamilyMember = async (
    patientId,
    familyMemberId
) => {
    const familyMember = await FamilyMember.findOne({
        _id: familyMemberId,
        patient: patientId,
        status: "active",
    });

    if (!familyMember) {
        throw new Error("Family member not found");
    }

    return buildFamilyMemberResponse(familyMember);
};

const updateFamilyMember = async (
    patientId,
    familyMemberId,
    updateData
) => {
    const familyMember = await FamilyMember.findOne({
        _id: familyMemberId,
        patient: patientId,
        status: "active",
    });

    if (!familyMember) {
        throw new Error("Family member not found");
    }

    const allowedFields = [
        "firstName",
        "middleName",
        "lastName",
        "relationship",
        "dateOfBirth",
        "gender",
        "email",
        "phone",
        "insuranceCoverage",
    ];

    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            familyMember[field] = updateData[field];
        }
    }

    if (updateData.address) {
        familyMember.address = {
            ...familyMember.address?.toObject?.(),
            ...updateData.address,
        };
    }

    // Save only to FamilyMember collection, leaving patient profile untouched
    await familyMember.save();

    return buildFamilyMemberResponse(familyMember);
};

const removeFamilyMember = async (
    patientId,
    familyMemberId
) => {
    const familyMember = await FamilyMember.findOne({
        _id: familyMemberId,
        patient: patientId,
        status: "active",
    });

    if (!familyMember) {
        throw new Error("Family member not found");
    }

    familyMember.status = "inactive";

    await familyMember.save();

    return {
        familyMemberId: familyMember._id,
        message: "Family member removed successfully",
    };
};

module.exports = {
    createFamilyMember,
    getFamilyMembers,
    getFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
};