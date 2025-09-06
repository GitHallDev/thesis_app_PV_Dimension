// src/routes/onduleurManagementRoutes.js

const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const {
  getOnduleurById,
  updateOnduleur,
  deleteOnduleur,
  createOnduleur,
  getAllOnduleurByOwner,
} = require("../controllers/onduleurManagementController");

// récupérer un onduleur par id
router.get("/get/:id", authenticate, getOnduleurById);
// mettre à jour un onduleur
router.put("/update/:id", authenticate, updateOnduleur);
// supprimer un onduleur
router.delete("/delete/:id", authenticate, deleteOnduleur);
// récupérer tous les onduleurs en fonction de l'id de l'utilisateur
router.get("/getAllByOwner", authenticate, getAllOnduleurByOwner);

// créer un onduleur
router.post("/create", authenticate, createOnduleur);

module.exports = router;