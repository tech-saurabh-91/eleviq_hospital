const mongoose = require("mongoose");
const companyService = require("./company.service");

const createCompany = async (req,res) =>{
    try{
        const company = await companyService.createCompany(req.body);

        return res.status(200).json({
            success: true,
            message: "Company created successfully",
            data:company,
        });
    }catch(error){
        return res.status(400).json({
            success: false,
            message:error.message,
        });
    }
};

const getCompanies = async(req,res)=>{
    try{
        const companies = await companyService.getCompanies();

        return res.status(200).json({
            success: true,
            message: "Companies fetched successfully",
            data: companies,
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getCompanyById = async (req,res) =>{
    try{
        const { id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message:"Invalid company ID",
            });
        }

        const company = await companyService.getCompanyById(id);

        return res.status(200).json({
            success: true,
            message:"Company fetched successfully",
            data:company,
        });
        
    }catch(error){
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports={
    createCompany,
    getCompanies,
    getCompanyById,
};