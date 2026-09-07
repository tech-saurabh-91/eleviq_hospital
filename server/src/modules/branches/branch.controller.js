const mongoose = require("mongoose");
const branchService = require("./branch.service");

const createBranch = async (req, res) => {
    try {
        const branch = await branchService.createBranch(req.body);

        return res.status(201).json({
            success: true,
            message: "Branch created successfully",
            data: branch,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getBranches = async (req, res) => {
    try {
        const branches = await branchService.getBranches();

        return res.status(200).json({
            success: true,
            message: "Branches fetched successfully",
            data: branches,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getBranchById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid branch ID",
            });
        }

        const branch = await branchService.getBranchById(id);

        return res.status(200).json({
            success: true,
            message: "Branch fetched successfully",
            data: branch,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createBranch,
    getBranches,
    getBranchById,
};