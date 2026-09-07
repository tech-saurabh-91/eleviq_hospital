const express = require("express");

const validate = require("../../middleware/validate");
const authenticate = require("../../middleware/auth");
const authorize = require("../../middleware/authorize");

const {
    createTermsSchema,
    updateTermsSchema,
} = require("./terms.validation");

const {
    createTerms,
    getActiveTerms,
    getAllTerms,
    updateTerms,
} = require("./terms.controller");

const router = express.Router();

// Public registration screen
router.get(
    "/active",
    getActiveTerms
);

// Admin management
router.get(
    "/",
    authenticate,
    authorize("terms.read"),
    getAllTerms
);

router.post(
    "/",
    authenticate,
    authorize("terms.create"),
    validate(createTermsSchema),
    createTerms
);

router.patch(
    "/:id",
    authenticate,
    authorize("terms.update"),
    validate(updateTermsSchema),
    updateTerms
);

module.exports = router;