const express = require("express");

const validate = require("../../middleware/validate");
const authenticate = require("../../middleware/auth");
const authorize = require("../../middleware/authorize");

const {
    createDepartmentSchema,
} = require("./department.validation");

const {
    createDepartment,
    getDepartments,
    getDepartmentById,
} = require("./department.controller");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("department.create"),
    validate(createDepartmentSchema),
    createDepartment
);

router.get(
    "/",
    authenticate,
    authorize("department.read"),
    getDepartments
);

router.get(
    "/:id",
    authenticate,
    authorize("department.read"),
    getDepartmentById
);

module.exports = router;