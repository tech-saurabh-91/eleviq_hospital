const express = require("express");

const validate = require("../../middleware/validate");

const authenticate = require("../../middleware/auth");
const authorize = require("../../middleware/authorize");

const {createCompanySchema} = require("./company.validation");

const {
    createCompany,
    getCompanies,
    getCompanyById,
} = require("./company.controller");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("company.create"),
    validate(createCompanySchema),
    createCompany
);

router.get("/",
    authenticate,
    authorize("company.read"),
    getCompanies
);

router.get(
    "/:id",
    authenticate,
    authorize("company.read"),
    getCompanyById
);

module.exports = router;