// src/routes/uploadRoutes.js

const express = require("express");
const upload = require("../utils/multerConfig");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const { uploadProjectProfile } = require("../controllers/projectController");

router.post(
  "/project_profile",
  authenticate,
  upload.single("file"),
  uploadProjectProfile
);
module.exports = router;
