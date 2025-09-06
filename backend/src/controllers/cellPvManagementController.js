const PVModuleComposant = require("../models/pv_module_composant");
require("dotenv").config();

// Créer un module PV
const createCellPv = async (req, res) => {
  try {
    // récupération de l'id de l'utilisateur
    const id_owner = req.user.id;

    const {
      fabricant,
      model,
      technologie,
      puissance_crete,
      tension_puissance_maximale,
      courant_puissance_maximale,
      tension_a_vide,
      courant_court_circuit,
      tolerance_puissance,
      nombre_cellule,
      dimension_module_longueur,
      dimension_module_largeur,
      dimension_module_hauteur,
      coefficient_temperature_courant,
      coefficient_temperature_tension,
      coefficient_temperature_puissance,
      plage_temperature_fonctionnement,
      poids_module,
      rendement_cellule,
      rendement_module,
      condition_standard_test,
      prix,
    } = req.body;

    // vérification des champs obligatoire
    if (
      !fabricant ||
      !model ||
      !technologie ||
      !puissance_crete ||
      !rendement_module ||
      !prix
    ) {
      return res.status(400).json({
        message: "Assurez-vous de remplir tous les champs obligatoire",
      });
    }

    // création du module PV
    const moduleComposant = await PVModuleComposant.create({
      fabricant,
      model,
      technologie,
      puissance_crete,
      tension_puissance_maximale,
      courant_puissance_maximale,
      tension_a_vide,
      courant_court_circuit,
      tolerance_puissance,
      nombre_cellule,
      dimension_module_longueur,
      dimension_module_largeur,
      dimension_module_hauteur,
      coefficient_temperature_courant,
      coefficient_temperature_tension,
      coefficient_temperature_puissance,
      plage_temperature_fonctionnement,
      poids_module,
      rendement_cellule,
      rendement_module,
      condition_standard_test,
      prix,
      id_owner,
    });

    res.status(200).json({
      success: true,
      message: "Module PV créé avec succès",
      data: moduleComposant,
    });
  } catch (error) {
    console.error("Erreur lors de la création du module PV :", error);

    res.status(500).json({
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

// Récupérer tous les modules PV en fonction de l'id de l'utilisateur
const getAllCellPvByOwner = async (req, res) => {
  // récupération de l'id de l'utilisateur
  const id_owner = req.user.id;

  try {
    const modules = await PVModuleComposant.findAll({ where: { id_owner } });
    res.status(200).json({
      success: true,
      message: "Modules récupérés avec succès",
      data: modules,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des modules :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

// Récupérer un module PV par id
const getCellPvById = async (req, res) => {
  try {
    const { id } = req.params;
    const module = await PVModuleComposant.findByPk(id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module non trouvé",
      });
    }
    // vérification de l'appartenance de l'utilisateur
    if (module.id_owner !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas l'autorisation d'accéder à ce module",
      });
    }

    res.status(200).json({
      success: true,
      message: "Module récupéré avec succès",
      data: module,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du module :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

// Mettre à jour un module PV
const updateCellPv = async (req, res) => {
  try {
    const { id } = req.params;
    const module = await PVModuleComposant.findByPk(id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module non trouvé",
      });
    }
    // vérification de l'appartenance de l'utilisateur
    if (module.id_owner !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas l'autorisation de mettre à jour ce module",
      });
    }

    // récu^pération des champs obligatoire
     const {
      fabricant,
      model,
      technologie,
      puissance_crete,
      rendement_module,
      prix,
    } = req.body;

    // vérification des champs obligatoire
    if (
      !fabricant ||
      !model ||
      !technologie ||
      !puissance_crete ||
      !rendement_module ||
      !prix
    ) {
      return res.status(400).json({
        message: "Assurez-vous de remplir tous les champs obligatoire",
      });
    }
    // mise à jour du module
    const updatedModule = await module.update( { id, id_owner:req.user.id,...req.body });
    res.status(200).json({
      success: true,
      message: "Module mis à jour avec succès",
      data: updatedModule,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du module :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

// Supprimer un module PV
const deleteCellPv = async (req, res) => {
  try {
    const { id } = req.params;
    const module = await PVModuleComposant.findByPk(id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module non trouvé",
      });
    }
    // vérification de l'appartenance de l'utilisateur
    if (module.id_owner !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas l'autorisation de supprimer ce module",
      });
    }
    // suppression du module
    await module.destroy(id);
    res.status(200).json({
      success: true,
      message: "Module supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du module :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

module.exports = {
  createCellPv,
  getAllCellPvByOwner,
  getCellPvById,
  updateCellPv,
  deleteCellPv,
};
