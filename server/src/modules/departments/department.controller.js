const mongoose = require("mongoose");
const departmentService = require("./department.service");

const createDepartment = async (req, res) => {
    try {
        const department = await departmentService.createDepartment(req.body);

        return res.status(201).json({
            success: true,
            message: "Department created successfully",
            data: department,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getDepartments = async (req, res) => {
    try {
        const departments = await departmentService.getDepartments();

        return res.status(200).json({
            success: true,
            message: "Departments fetched successfully",
            data: departments,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid department ID",
            });
        }

        const department = await departmentService.getDepartmentById(id);

        return res.status(200).json({
            success: true,
            message: "Department fetched successfully",
            data: department,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createDepartment,
    getDepartments,
    getDepartmentById,
};