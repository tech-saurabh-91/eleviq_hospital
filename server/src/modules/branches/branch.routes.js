const express = require("express");

const validate = require("../../middleware/validate");
const authenticate = require("../../middleware/auth");
const authorize = require("../../middleware/authorize");

const {
    createBranchSchema,
} = require("./branch.validation");

const {
    createBranch,
    getBranches,
    getBranchById,
} = require("./branch.controller");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("branch.create"),
    validate(createBranchSchema),
    createBranch
);

router.get(
    "/",
    authenticate,
    authorize("branch.read"),
    getBranches
);

router.get(
    "/:id",
    authenticate,
    authorize("branch.read"),
    getBranchById
);

module.exports = router;