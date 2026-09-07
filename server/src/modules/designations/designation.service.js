const Designation = require("./designation.model");
const Department = require("../departments/department.model");

const createDesignation = async (designationData) => {
    const department = await Department.findById(
        designationData.departmentId
    );

    if (!department) {
        throw new Error("Department not found");
    }

    const existingDesignation = await Designation.findOne({
        departmentId: designationData.departmentId,
        code: designationData.code,
    });

    if (existingDesignation) {
        throw new Error(
            "Designation with same code already exists for this department"
        );
    }

    const designation = await Designation.create(designationData);

    return designation;
};

const getDesignations = async () => {
    const designations = await Designation.find()
        .populate("departmentId", "name code branchId")
        .sort({
            createdAt: -1,
        });

    return designations;
};

const getDesignationById = async (designationId) => {
    const designation = await Designation.findById(designationId)
        .populate("departmentId", "name code branchId");

    if (!designation) {
        throw new Error("Designation not found");
    }

    return designation;
};

module.exports = {
    createDesignation,
    getDesignations,
    getDesignationById,
};