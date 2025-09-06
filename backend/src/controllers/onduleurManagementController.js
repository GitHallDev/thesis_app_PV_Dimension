const OnduleurComposant = require("../models/onduleur_composant");
require("dotenv").config();

// Créer un module PV
const createOnduleur = async (req, res) => {
  try {
    // récupération de l'id de l'utilisateur
    const id_owner = req.user.id;

    const {
      fabricant,
      model,
      technologie,
      puissance_nominale_AC,
      tension_entree_max_DC,
      courant_entree_max,
      plage_MPPT_min,
      plage_MPPT_max,
      nbr_tracker_MPPT,
      rendement_max,
      puissance_sortie_max,
      type_sortie,
      dimension_longueur,
      dimension_largeur,
      dimension_hauteur,
      poids,
      prix,
    } = req.body;

    // vérification des champs obligatoire
    if (
      !fabricant ||
      !model ||
      !technologie ||
      !puissance_nominale_AC ||
      !tension_entree_max_DC ||
      !courant_entree_max ||
      !prix
    ) {
      return res.status(400).json({
        message: "Assurez-vous de remplir tous les champs obligatoire",
      });
    }

    // création d'un onduleur
    const onduleurComposant = await OnduleurComposant.create({
      fabricant,
      model,
      technologie,
      puissance_nominale_AC,
      tension_entree_max_DC,
      courant_entree_max,
      plage_MPPT_min,
      plage_MPPT_max,
      nbr_tracker_MPPT,
      rendement_max,
      puissance_sortie_max,
      type_sortie,
      dimension_longueur,
      dimension_largeur,
      dimension_hauteur,
      poids,
      prix,
      id_owner,
    });

    res.status(200).json({
      success: true,
      message: "Onduleur créé avec succès",
      data: onduleurComposant,
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'onduleur :", error);

    res.status(500).json({
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

// Récupérer tous les onduleur en fonction de l'id de l'utilisateur
const getAllOnduleurByOwner = async (req, res) => {
  // récupération de l'id de l'utilisateur
  const id_owner = req.user.id;

  try {
    const onduleurs = await OnduleurComposant.findAll({ where: { id_owner } });
    res.status(200).json({
      success: true,
      message: "Onduleurs récupérés avec succès",
      data: onduleurs,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des onduleurs :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

// Récupérer un onduleur par id
const getOnduleurById = async (req, res) => {
  try {
    const { id } = req.params;
    const onduleur = await OnduleurComposant.findByPk(id);
    if (!onduleur) {
      return res.status(404).json({
        success: false,
        message: "Onduleur non trouvé",
      });
    }
    // vérification de l'appartenance de l'utilisateur
    if (onduleur.id_owner !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas l'autorisation d'accéder à cet onduleur",
      });
    }

    res.status(200).json({
      success: true,
      message: "Onduleur récupéré avec succès",
      data: onduleur,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'onduleur :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

// Mettre à jour un onduleur
const updateOnduleur = async (req, res) => {
  try {
    const { id } = req.params;
    const onduleur = await OnduleurComposant.findByPk(id);
    if (!onduleur) {
      return res.status(404).json({
        success: false,
        message: "Onduleur non trouvé",
      });
    }
    // vérification de l'appartenance de l'utilisateur
    if (onduleur.id_owner !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas l'autorisation de mettre à jour cet onduleur",
      });
    }

    // récupérer les champs obligatoires
    const {
      fabricant,
      model,
      technologie,
      puissance_nominale_AC,
      tension_entree_max_DC,
      courant_entree_max,
      prix,
    } = req.body;

    // vérification des champs obligatoire
    if (
      !fabricant ||
      !model ||
      !technologie ||
      !puissance_nominale_AC ||
      !tension_entree_max_DC ||
      !courant_entree_max ||
      !prix
    ) {
      return res.status(400).json({
        message: "Assurez-vous de remplir tous les champs obligatoire",
      });
    }

    // mise à jour de l'onduleur

    const updatedOnduleur = await onduleur.update({
      id,
      id_owner: req.user.id,
      ...req.body,
    });
    res.status(200).json({
      success: true,
      message: "Onduleur mis à jour avec succès",
      data: updatedOnduleur,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'onduleur :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

// Supprimer un onduleur
const deleteOnduleur = async (req, res) => {
  try {
    const { id } = req.params;
    const onduleur = await OnduleurComposant.findByPk(id);
    if (!onduleur) {
      return res.status(404).json({
        success: false,
        message: "Onduleur non trouvé",
      });
    }
    // vérification de l'appartenance de l'utilisateur
    if (onduleur.id_owner !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas l'autorisation de supprimer cet onduleur",
      });
    }
    // suppression de l'onduleur
    await onduleur.destroy(id);
    res.status(200).json({
      success: true,
      message: "Onduleur supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'onduleur :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

module.exports = {
  createOnduleur,
  getAllOnduleurByOwner,
  getOnduleurById,
  updateOnduleur,
  deleteOnduleur,
};
