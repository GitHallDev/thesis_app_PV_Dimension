// src/routes/cellPVManagementRoutes.js

const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const {
  getCellPvById,
  updateCellPv,
  deleteCellPv,
  createCellPv,
  getAllCellPvByOwner,
} = require("../controllers/cellPvManagementController");

// récupérer un module PV par id
router.get("/get/:id", authenticate, getCellPvById);
// mettre à jour un module PV
router.put("/update/:id", authenticate, updateCellPv);
// supprimer un module PV
router.delete("/delete/:id", authenticate, deleteCellPv);
// récupérer tous les modules PV en fonction de l'id de l'utilisateur
router.get("/getAllByOwner", authenticate, getAllCellPvByOwner);

// créer un module PV
router.post("/create", authenticate, createCellPv);

module.exports = router;
