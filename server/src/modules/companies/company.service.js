const Company = require("./company.model");

const createCompany = async(companyData) =>{
    const existingCompany = await Company.findOne({
        $or:[
            {name:companyData.name},
            {code: companyData.code},
        ],
    });

    if(existingCompany){
        throw new Error("Company with same name or code already exists");
    }
    const company = await Company.create(companyData);

    return company;
};

const getCompanies = async ()=>{
    const companies = await Company.find().sort({
        createdAt: -1,
    });

    return companies;
};

const getCompanyById = async (companyId) =>{
    const company = await Company.findById(companyId);

    if(!company){
        throw new Error("Company not found");
    }

    return company;
};

module.exports={
    createCompany,
    getCompanies,
    getCompanyById,
};