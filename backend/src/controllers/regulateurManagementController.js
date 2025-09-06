const RegulateurComposant = require("../models/regulateur_composant");
require("dotenv").config();

// Créer d'un regulateur
const createRegulateur = async (req, res) => {
  try {
    // récupération de l'id de l'utilisateur
    const id_owner = req.user.id;

    const {
      fabricant,
      model,
      dimension_longueur,
      dimension_largeur,
      dimension_hauteur,
      poids,
      prix,
    } = req.body;

    // vérification des champs obligatoire
    if (!fabricant || !model || !prix) {
      return res.status(400).json({
        message: "Assurez-vous de remplir tous les champs obligatoire",
      });
    }

    // création d'un regulateur
    const regulateurComposant = await RegulateurComposant.create({
      fabricant,
      model,
      dimension_longueur,
      dimension_largeur,
      dimension_hauteur,
      poids,
      prix,
      id_owner,
    });

    res.status(200).json({
      success: true,
      message: "Regulateur créé avec succès",
      data: regulateurComposant,
    });
  } catch (error) {
    console.error("Erreur lors de la création du regulateur :", error);

    res.status(500).json({
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

// Récupérer tous les regulateurs en fonction de l'id de l'utilisateur
const getAllRegulateurByOwner = async (req, res) => {
  // récupération de l'id de l'utilisateur
  const id_owner = req.user.id;

  try {
    const regulateurs = await RegulateurComposant.findAll({
      where: { id_owner },
    });
    res.status(200).json({
      success: true,
      message: "regulateurs récupérés avec succès",
      data: regulateurs,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des regulateurs :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

// Récupérer un regulateur par id
const getRegulateurById = async (req, res) => {
  try {
    const { id } = req.params;

    const regulateur = await RegulateurComposant.findByPk(id);
    if (!regulateur) {
      return res.status(404).json({
        success: false,
        message: "Regulateur non trouvé",
      });
    }
    // vérification de l'appartenance de l'utilisateur
    if (regulateur.id_owner !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas l'autorisation d'accéder à ce regulateur",
      });
    }

    res.status(200).json({
      success: true,
      message: "Regulateur récupéré avec succès",
      data: regulateur,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du regulateur :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

// Mettre à jour un regulateur
const updateRegulateur = async (req, res) => {
  try {
    const { id } = req.params;
    const regulateur = await RegulateurComposant.findByPk(id);
    if (!regulateur) {
      return res.status(404).json({
        success: false,
        message: "Regulateur non trouvé",
      });
    }
    // vérification de l'appartenance de l'utilisateur
    if (regulateur.id_owner !== req.user.id) {
      return res.status(403).json({
        success: false,
        message:
          "Vous n'avez pas l'autorisation de mettre à jour ce regulateur",
      });
    }

    // récupérer les champs obligatoires
    const { fabricant, model, prix } = req.body;

    // vérification des champs obligatoire
    if (!fabricant || !model || !prix) {
      return res.status(400).json({
        message: "Assurez-vous de remplir tous les champs obligatoire",
      });
    }

    // mise à jour du regulateur

    const updatedRegulateur = await regulateur.update({
      id,
      id_owner: req.user.id,
      ...req.body,
    });
    res.status(200).json({
      success: true,
      message: "Regulateur mis à jour avec succès",
      data: updatedRegulateur,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du regulateur :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

// Supprimer un regulateur
const deleteRegulateur = async (req, res) => {
  try {
    const { id } = req.params;
    const regulateur = await RegulateurComposant.findByPk(id);
    if (!regulateur) {
      return res.status(404).json({
        success: false,
        message: "Regulateur non trouvé",
      });
    }
    // vérification de l'appartenance de l'utilisateur
    if (regulateur.id_owner !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas l'autorisation de supprimer ce regulateur",
      });
    }
    // suppression du regulateur
    await regulateur.destroy(id);
    res.status(200).json({
      success: true,
      message: "Regulateur supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du regulateur :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

module.exports = {
  createRegulateur,
  getAllRegulateurByOwner,
  getRegulateurById,
  updateRegulateur,
  deleteRegulateur,
};
