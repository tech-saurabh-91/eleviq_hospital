const mongoose = require("mongoose");
const designationService = require("./designation.service");

const createDesignation = async (req, res) => {
    try {
        const designation = await designationService.createDesignation(req.body);

        return res.status(201).json({
            success: true,
            message: "Designation created successfully",
            data: designation,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getDesignations = async (req, res) => {
    try {
        const designations = await designationService.getDesignations();

        return res.status(200).json({
            success: true,
            message: "Designations fetched successfully",
            data: designations,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getDesignationById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid designation ID",
            });
        }

        const designation = await designationService.getDesignationById(id);

        return res.status(200).json({
            success: true,
            message: "Designation fetched successfully",
            data: designation,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createDesignation,
    getDesignations,
    getDesignationById,
};