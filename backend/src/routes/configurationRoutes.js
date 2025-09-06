// src/routes/configurationRoutes.js

const express = require("express");
const router = express.Router();
const {
  CreateConfiguration,
  ListConfigurations,
  ConfigurationDetails,
  updateConfiguration,
  lockedConfiguration,
  duplicateConfiguration,
  archiveConfiguration,
} = require("../controllers/configurationController");

const {
    RunSimulation,
    RunHistoryByConfig,
    RunDetails,
} = require("../controllers/runController");

const { authenticate } = require("../middlewares/authMiddleware");

// CRUD de base de configurations

// Création d'une configuration
router.post(
  "/projects/:projectId/configurations",
  authenticate,
  CreateConfiguration
);

// lister les configurations
router.get(
  "/projects/:projectId/configurations",
  authenticate,
  ListConfigurations
);

// Détail d'une configuration (inclure les dernièrs resultats)
router.get("/configurations/:id", authenticate, ConfigurationDetails);

// modifier une configuration métadonnées/inputs(si non vérouillée)
router.patch("/configurations/:id", authenticate, updateConfiguration);

// verouiller une configuration
router.post("/configurations/:id/lock", authenticate, lockedConfiguration);

// cloner une configuration
router.post(
  "/configurations/:id/duplicate",
  authenticate,
  duplicateConfiguration
);

// archiver/supprimer une configuration
router.delete("/configurations/:id", authenticate, archiveConfiguration);

// Endpoints pour les simulations

// lancer une simulation (synchro simple ou file jobs)
router.post("/configurations/:id/run", authenticate,RunSimulation);

// historique des runs d'une configuration
router.get("/configurations/:id/runs", authenticate,RunHistoryByConfig);

// resultats détaillés (incl timeseries paginées)
router.get("/configurations/runs/:runId/results", authenticate,RunDetails
);

// générer un rapport
router.post("/configurations/runs/:runId/report", authenticate);

module.exports = router;
