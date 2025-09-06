// src/controllers/configurationController.js

const Configuration = require("../models/configuration");

// créer une configuration
const CreateConfiguration = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, inputs, basedOn } = req.body;

    if (!name || name.length < 2) {
      return res.status(400).json({
        error:
          "Le champ 'nom' est obligatoire et doit contenir au moins 2 caractères.",
      });
    }

    // création de la configuration
    const config = await Configuration.create({
      project_id: projectId,
      name,
      description,
      inputs: inputs || {},
      based_on_configuration_id: basedOn || null,
    });

    return res.status(201).json(config);
  } catch (error) {
    console.error("Erreur lors de la création de la configuration:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Lister les configurations d'un projet
const ListConfigurations = async (req, res) => {
  try {
    const { projectId } = req.params;

    const configs = await Configuration.findAll({
      where: {
        project_id: projectId,
      },
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json(configs);
  } catch (error) {
    console.error("Erreur lors de la récupération des configurations:", error);
    return res
      .status(500)
      .json({ error: "Erreur interne lors de la récupération" });
  }
};

// Obtenir toutes les infos d'une condifguration y compris (ses inputs, status, etc)
const ConfigurationDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const config = await Configuration.findByPk(id);
    if (!config) {
      return res.status(404).json({ error: "Configuration non trouvée" });
    }

    return res.status(200).json(config);
  } catch (error) {
    console.error("Erreur lors de la récupération de la configuration:", error);
    return res
      .status(500)
      .json({ error: "Erreur interne lors de la récupération" });
  }
};

// Modifier une configuration
const updateConfiguration = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, inputs, is_baseline } = req.body;

    const config = await Configuration.findByPk(id);

    if (!config) {
      return res.status(404).json({ error: "Configuration non trouvée" });
    }

    // vérifier si la config est vérouillée
    if (config.locked_at) {
      return res.status(400).json({
        error:
          "Cette configuration est verrouillée et ne peut pas être modifiée",
      });
    }

    // Mise à jour des champs autorisés
    if (name) config.name = name;
    if (description) config.description = description;
    if (inputs) config.inputs = inputs;
    if (typeof is_baseline === "boolean") config.is_baseline = is_baseline;

    await config.save();

    return res
      .status(200)
      .json({ message: "Configuration modifiée avec succès", config });
  } catch (error) {
    console.error("Erreur lors de la modification de la configuration:", error);
    return res
      .status(500)
      .json({ error: "Erreur interne lors de la modification : ", error });
  }
};

// Verouiller une configuration
const lockedConfiguration = async (req, res) => {
  try {
    // récupération de l'id de l'utilisateur
    const id_owner = req.user.id;

    const { id } = req.params;

    const config = await Configuration.findByPk(id);

    if (!config) {
      return res.status(400).json({ error: "Configuration introuvable" });
    }

    if (config.locked_at) {
      return res
        .status(400)
        .json({ error: "Cette configuration est déjà verrouillée" });
    }

    config.locked_at = new Date();
    config.locked_by = id_owner;

    // Quand une configuration est vérouillé, on peut aussi passer son statut à "ready"
    config.status = "ready";

    await config.save();

    return res.status(200).json(config);
  } catch (error) {
    console.error("Erreur lors du verrouillage:", err);
    return res
      .status(500)
      .json({ error: "Erreur interne lors du verrouillage" });
  }
};

// Dupliquer une configuration
const duplicateConfiguration = async (req, res) => {
  try {
    const { id } = req.params;

    const original = await Configuration.findByPk(id);

    if (!original) {
      return res.status(404).json({ error: "Configuration introuvable" });
    }

    // Nouveau nom (éviter conflit  avec index unique)
    let newName = `${original.name} - copy`;

    // vérifier si ce nom exite déjà
    const existing = await Configuration.findOne({
      where: { project_id: original.project_id, name: newName },
    });

    if (existing) {
      // si déjà pris,  on ajoute un timestamp
      newName = `${original.name} - copy ${Date.now()}`;
    }

    const duplicated = await Configuration.create({
      project_id: original.project_id,
      name: newName,
      description: original.description,
      inputs: original.inputs,
      based_on_configuration_id: original.id,
      status: "draft",
      is_baseline: false,
      version: 1,
    });

    return res.status(201).json(duplicated);
  } catch (error) {
    console.error("Erreur lors de la duplication:", err);
    return res
      .status(500)
      .json({ error: "Erreur interne lors de la duplication" });
  }
};

// Archiver/Supprimer une configuration
const archiveConfiguration = async (req, res) => {
  try {
    const { id } = req.params;

    const config = await Configuration.findByPk(id);

    if (!config) {
      return res.status(404).json({ error: "Configuration introuvable" });
    }

    if (config.status === "archived") {
      return res.status(400).json({ error: "Configuration déjà archivée" });
    }

    config.status = "archived";
    await config.save();

    return res
      .status(200)
      .json({ message: "configuration archivée avec succès" });
  } catch (error) {
    console.error("Erreur lors de l’archivage:", error);
    return res
      .status(500)
      .json({ error: "Erreur interne lors de l’archivage" });
  }
};
module.exports = {
  CreateConfiguration,
  ListConfigurations,
  ConfigurationDetails,
  updateConfiguration,
  lockedConfiguration,
  duplicateConfiguration,
  archiveConfiguration,
};
