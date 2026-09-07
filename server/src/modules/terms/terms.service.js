const Terms = require("./terms.model");

const createTerms = async (termsData) => {
    if(termsData.status === "active"){
        await Terms.updateMany(
            {status:"active"},
            {$set:{status:"inactive"}}
        );

        termsData.publishedAt = new Date();
    }

    const terms = await Terms.create(termsData);

    return terms;
};

const getActiveTerms = async () =>{
    const terms = await Terms.findOne({
        status:"active",
    }).sort({
        createdAt: -1,
    })

    if(!terms){
        throw new Error("Active Terms & conditions not found");
    }

    return terms;
};

const getAllTerms = async ()=>{
    return (await Terms.find()).sort({
        createdAt: -1,
    });
};

const updateTerms = async (termsId, termsData) =>{
    if(termsData.status === "active"){
        await Terms.updateMany({
            _id:{$ne:termsId},
            status:"active",
        },
    {
        $set:{status:"inactive"},
    });

    termsData.publishedAt = new Date();
    }

    const terms = await Terms.findByIdAndUpdate(
        termsId,
        termsData,
        {
            new: true,
            runValidators: true,
        }
    );

    if(!terms){
        throw new Error ("Terms & Conditions not found");
    }

    return terms;
};

module.exports ={
    createTerms,
    getActiveTerms,
    getAllTerms,
    updateTerms,
};