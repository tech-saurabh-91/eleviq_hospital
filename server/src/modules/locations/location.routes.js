const express = require("express");

const {
    getLocations,
    getStates,
    getStateCities,
} = require("./location.controller");

const router = express.Router();

router.get("/", getLocations);
router.get("/states", getStates);
router.get("/:state/cities", getStateCities);

module.exports = router;