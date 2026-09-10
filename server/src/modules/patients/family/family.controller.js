const familyService = require("./family.service");

const createFamilyMember = async (req, res) => {
    
    try {
        const result =
            await familyService.createFamilyMember(
                req.user._id,
                req.body,
                req.uploadedImage
            );

        return res.status(201).json({
            success: true,
            message:
                "Family member added successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getFamilyMembers = async (req, res) => {
    try {
        const result =
            await familyService.getFamilyMembers(
                req.user._id
            );

        return res.status(200).json({
            success: true,
            message:
                "Family members fetched successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getFamilyMember = async (req, res) => {
    try {
        const result =
            await familyService.getFamilyMember(
                req.user._id,
                req.params.familyMemberId
            );

        return res.status(200).json({
            success: true,
            message:
                "Family member fetched successfully",
            data: result,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

const updateFamilyMember = async (req, res) => {
    try {
        const result =
            await familyService.updateFamilyMember(
                req.user._id,
                req.params.familyMemberId,
                req.body
            );

        return res.status(200).json({
            success: true,
            message:
                "Family member updated successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const removeFamilyMember = async (req, res) => {
    try {
        const result =
            await familyService.removeFamilyMember(
                req.user._id,
                req.params.familyMemberId
            );

        return res.status(200).json({
            success: true,
            message: result.message,
            data: {
                familyMemberId:
                    result.familyMemberId,
            },
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createFamilyMember,
    getFamilyMembers,
    getFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
};