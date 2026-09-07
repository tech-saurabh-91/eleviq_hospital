const Branch = require("./branch.model");
const Company = require("../companies/company.model");

const createBranch = async (branchData) => {
    const company = await Company.findById(branchData.companyId);

    if (!company) {
        throw new Error("Company not found");
    }

    const existingBranch = await Branch.findOne({
        companyId: branchData.companyId,
        code: branchData.code,
    });

    if (existingBranch) {
        throw new Error(
            "Branch with same code already exists for this company"
        );
    }

    const branch = await Branch.create(branchData);

    return branch;
};

const getBranches = async () => {
    const branches = await Branch.find()
        .populate("companyId", "name code")
        .sort({
            createdAt: -1,
        });

    return branches;
};

const getBranchById = async (branchId) => {
    const branch = await Branch.findById(branchId)
        .populate("companyId", "name code");

    if (!branch) {
        throw new Error("Branch not found");
    }

    return branch;
};

module.exports = {
    createBranch,
    getBranches,
    getBranchById,
};