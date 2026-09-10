const FamilyMember = require("./family-member.model");

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
    const familyMember =
        await FamilyMember.create({
            patient: patientId,

            firstName: familyData.firstName,
            middleName: familyData.middleName,
            lastName: familyData.lastName,

            relationship:
                familyData.relationship,

            dateOfBirth:
                familyData.dateOfBirth,

            gender: familyData.gender,

            email: familyData.email,
            phone: familyData.phone,

            address: familyData.address,

            insuranceCoverage:
                familyData.insuranceCoverage || "patient",

            profilePicture: uploadedImage
                ? {
                    publicId:
                        uploadedImage.publicId,
                    url:
                        uploadedImage.url,
                }
                : undefined,
        });

    return buildFamilyMemberResponse(
        familyMember
    );
};

const getFamilyMembers = async (patientId) => {
    const familyMembers =
        await FamilyMember.find({
            patient: patientId,
            status: "active",
        }).sort({
            createdAt: -1,
        });

    return familyMembers.map(
        buildFamilyMemberResponse
    );
};

const getFamilyMember = async (
    patientId,
    familyMemberId
) => {
    const familyMember =
        await FamilyMember.findOne({
            _id: familyMemberId,
            patient: patientId,
            status: "active",
        });

    if (!familyMember) {
        throw new Error(
            "Family member not found"
        );
    }

    return buildFamilyMemberResponse(
        familyMember
    );
};

const updateFamilyMember = async (
    patientId,
    familyMemberId,
    updateData
) => {
    const familyMember =
        await FamilyMember.findOne({
            _id: familyMemberId,
            patient: patientId,
            status: "active",
        });

    if (!familyMember) {
        throw new Error(
            "Family member not found"
        );
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
            familyMember[field] =
                updateData[field];
        }
    }

    if (updateData.address) {
        familyMember.address = {
            ...familyMember.address?.toObject?.(),
            ...updateData.address,
        };
    }

    await familyMember.save();

    return buildFamilyMemberResponse(
        familyMember
    );
};

const removeFamilyMember = async (
    patientId,
    familyMemberId
) => {
    const familyMember =
        await FamilyMember.findOne({
            _id: familyMemberId,
            patient: patientId,
            status: "active",
        });

    if (!familyMember) {
        throw new Error(
            "Family member not found"
        );
    }

    familyMember.status = "inactive";

    await familyMember.save();

    return {
        familyMemberId:
            familyMember._id,

        message:
            "Family member removed successfully",
    };
};

module.exports = {
    createFamilyMember,
    getFamilyMembers,
    getFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
};