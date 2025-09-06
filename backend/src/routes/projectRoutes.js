// src/routes/projectRoutes.js

const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const {
  getProjectById,
  updateProject,
  deleteProject,
  createProject,
  getAllProjectByOwner,
  uploadProjectProfile,
} = require("../controllers/projectController");

// récupérer un projet par id
router.get("/get/:id", authenticate, getProjectById);
// mettre à jour un projet
router.put("/update/:id", authenticate, updateProject);
// supprimer un projet
router.delete("/delete/:id", authenticate, deleteProject);
// récupérer tous les projets en fonction de l'id de l'utilisateur
router.get("/getAllByOwner", authenticate, getAllProjectByOwner);

// créer un projet
router.post("/create", authenticate, createProject);
router.post("/uploads",authenticate,uploadProjectProfile)
module.exports = router;
