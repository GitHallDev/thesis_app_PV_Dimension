const Project = require("../models/project");
require("dotenv").config();
const fs = require("fs");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile); // Pour écrire le buffer sur disque
const UPLOAD_DIR = "upload/projects/profile"; // le repertoire pour stocker le fichier
const path = require("path");

// Créer un projet
const createProject = async (req, res) => {
  try {
    // récupération de l'id de l'utilisateur
    const id_owner = req.user.id;

    const {
      profil_url,
      project_name,
      customer_name,
      location_name,
      longitude,
      latitude,
      hauteur,
      status,
    } = req.body;

    // vérification des champs obligatoire
    if (
      !project_name ||
      !location_name ||
      !longitude ||
      !latitude ||
      !hauteur ||
      !status
    ) {
      return res.status(400).json({
        message: "Assurez-vous de remplir tous les champs obligatoire",
      });
    }

    // création d'un projet
    const project = await Project.create({
      profil_url,
      project_name,
      customer_name,
      location_name,
      longitude,
      latitude,
      hauteur,
      id_owner,
      status,
    });

    res.status(200).json({
      success: true,
      message: "Projet créé avec succès",
      data: project,
    });
  } catch (error) {
    console.error("Erreur lors de la création du projet :", error);

    res.status(500).json({
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

// Récupérer tous les projets en fonction de l'id de l'utilisateur
const getAllProjectByOwner = async (req, res) => {
  try {
    // récupération de l'id de l'utilisateur
    const id_owner = req.user.id;

    const projects = await Project.findAll({
      where: { id_owner },
    });

    res.status(200).json({
      success: true,
      message: "projets récupérés avec succès",
      data: projects,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

// Récupérer un projet par id
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet non trouvé",
      });
    }
    // vérification de l'appartenance de l'utilisateur
    if (project.id_owner !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas l'autorisation d'accéder à ce projet",
      });
    }

    res.status(200).json({
      success: true,
      message: "Projet récupéré avec succès",
      data: project,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du projet :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

// Mettre à jour un projet
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet non trouvé",
      });
    }
    // vérification de l'appartenance de l'utilisateur
    if (project.id_owner !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas l'autorisation de mettre à jour ce projet",
      });
    }

    // récupérer les champs obligatoires
    const {
      project_name,
      location_name,
      longitude,
      latitude,
      hauteur,
      status,
    } = req.body;

    // vérification des champs obligatoire
    if (
      !project_name ||
      !location_name ||
      !longitude ||
      !latitude ||
      !hauteur ||
      !status
    ) {
      return res.status(400).json({
        message: "Assurez-vous de remplir tous les champs obligatoire",
      });
    }

    // mise à jour du projet

    const updatedProject = await project.update({
      id,
      id_owner: req.user.id,
      ...req.body,
    });
    res.status(200).json({
      success: true,
      message: "Projet mis à jour avec succès",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

// Supprimer un projet
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet non trouvé",
      });
    }
    // vérification de l'appartenance de l'utilisateur
    if (project.id_owner !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas l'autorisation de supprimer ce projet",
      });
    }
    // suppression du projet
    await regulateur.destroy(id);
    res.status(200).json({
      success: true,
      message: "Projet supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du projet :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};

// uploadProfile
const uploadProjectProfile = async (req, res) => {
  try {
    const file = req.file;

    if (!file || !file.buffer) {
      return res
        .status(400)
        .json({ success: false, message: "Aucun fichier fourni." });
    }

    // on genere un nom de fichier unique avec la date actuelle et un nombre aléatoire.
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // on recupere l'extension du fichier a partir de son nom d'origine
    const fileExtension = path.extname(file.originalname);
    // on recupere le nom du fichier sans son extension
    const baseName = path.basename(file.originalname, fileExtension);
    // on remplace tous les caractères spéciaux du nom par _ pour éviter les problèmes de compatibilité
    const safeOriginalName = baseName.replace(/[^a-zA-Z0-9_.-]/g, "_");
    // on construit un nom de fichier final
    const fileName = `${safeOriginalName}-${uniqueSuffix}${fileExtension}`;

    // on concatène le dossier de destination (UPLOAD_DIR) avec le nom du fichier pour obtenir le chemin complet sur le disque.
    const profilePath = fileName;
    // Chemin complet où écrire le fichier
    const fullFilePath = path.join(UPLOAD_DIR, fileName);

    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // ecriture du buffer du fichier sur le disque
    await writeFileAsync(fullFilePath, file.buffer);
    console.log(`Fichier sauvegardé localement: ${fullFilePath}`);
    res.status(201).json({
      success: true,
      message: "Photo de profil projet sauvegardée avec succès",
      data: fullFilePath,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du profil projet :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue, réessayer plus tard.",
      error: error.message,
    });
  }
};
module.exports = {
  createProject,
  getAllProjectByOwner,
  getProjectById,
  updateProject,
  uploadProjectProfile,
  deleteProject,
};
