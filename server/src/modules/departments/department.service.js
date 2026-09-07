const Department = require("./department.model");
const Branch = require("../branches/branch.model");

const createDepartment = async (departmentData) => {
    const branch = await Branch.findById(departmentData.branchId);

    if (!branch) {
        throw new Error("Branch not found");
    }

    const existingDepartment = await Department.findOne({
        branchId: departmentData.branchId,
        code: departmentData.code,
    });

    if (existingDepartment) {
        throw new Error(
            "Department with same code already exists for this branch"
        );
    }

    const department = await Department.create(departmentData);

    return department;
};

const getDepartments = async () => {
    const departments = await Department.find()
        .populate("branchId", "name code companyId")
        .sort({
            createdAt: -1,
        });

    return departments;
};

const getDepartmentById = async (departmentId) => {
    const department = await Department.findById(departmentId)
        .populate("branchId", "name code companyId");

    if (!department) {
        throw new Error("Department not found");
    }

    return department;
};

module.exports = {
    createDepartment,
    getDepartments,
    getDepartmentById,
};