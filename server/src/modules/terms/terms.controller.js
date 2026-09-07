const mongoose = require("mongoose");

const termsService = require("./terms.service");

const createTerms = async (req,res) =>{
    try{
        const terms = await termsService.createTerms(req.body);

        return res.status(201).json({
            success: true,
            message: "Terms & Conditions created successfully",
            data: terms,
        });
    }catch(error){
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getActiveTerms = async (req,res) =>{
    try{
        const terms = await termsService.getActiveTerms();

        return res.status(200).json({
            success: true,
            message:"Active Terms & Conditions fetched Successfully",
            data:terms,
        });
    }catch(error){
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllTerms = async (req,res) => {
    try{
        const terms = await termsService.getAllTerms();

        return res.status(200).json({
            success: true,
            message: "Terms & Conditions fetched successfully",
            data: terms,
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateTerms = async (req,res) =>{
    try{
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid Terms ID",
            });
        }

        const terms = await termsService.updateTerms(
            id,
            req.body
        );
        return res.status(200).json({
            success: true,
            message: "Terms & Conditions updated successfully",
            data: terms,
        });
    }catch(error){
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createTerms,
    getActiveTerms,
    getAllTerms,
    updateTerms,
};