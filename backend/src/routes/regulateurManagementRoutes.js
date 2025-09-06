// src/routes/regulateurManagementRoutes.js

const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const {
  getRegulateurById,
  updateRegulateur,
  deleteRegulateur,
  createRegulateur,
  getAllRegulateurByOwner,
} = require("../controllers/regulateurManagementController");

// récupérer un regulateur par id
router.get("/get/:id", authenticate, getRegulateurById);
// mettre à jour un regulateur
router.put("/update/:id", authenticate, updateRegulateur);
// supprimer un regulateur
router.delete("/delete/:id", authenticate, deleteRegulateur);
// récupérer tous les regulateurs en fonction de l'id de l'utilisateur
router.get("/getAllByOwner", authenticate, getAllRegulateurByOwner);

// créer un regulateur
router.post("/create", authenticate, createRegulateur);

module.exports = router;