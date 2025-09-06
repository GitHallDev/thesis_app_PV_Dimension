// src/routes/pvGisRoutes.js

const express = require("express");

const router = express.Router();
const { serialcalc } = require("../controllers/pvGisController");

// Route to get PVGIS data
router.get("/seriescalc", serialcalc);

module.exports = router;
// This code defines a route for fetching PVGIS data using the Express framework.
