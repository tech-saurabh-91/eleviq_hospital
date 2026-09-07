const express = require("express");

const validate = require("../../middleware/validate");
const authenticate = require("../../middleware/auth");
const authorize = require("../../middleware/authorize");

const {
    createDesignationSchema,
} = require("./designation.validation");

const {
    createDesignation,
    getDesignations,
    getDesignationById,
} = require("./designation.controller");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("designation.create"),
    validate(createDesignationSchema),
    createDesignation
);

router.get(
    "/",
    authenticate,
    authorize("designation.read"),
    getDesignations
);

router.get(
    "/:id",
    authenticate,
    authorize("designation.read"),
    getDesignationById
);

module.exports = router;