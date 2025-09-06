const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const OnduleurComposant = sequelize.define(
  "OnduleurComposant",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Génère un UUID par défaut
      primaryKey: true,
    },
    fabricant: {
      // Fabricant : Compatibilité et support
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      // Référence / Modèle : Identification
      type: DataTypes.STRING,
      allowNull: false,
    },
    technologie: {
      // Type d'onduleur : Définit l’usage
      type: DataTypes.ENUM("Hybrides", "Réseau", "Hors-réseau"),
      allowNull: false,
    },
    puissance_nominale_AC: {
      // Puissance nominale AC : Doit être adaptée à la puissance PV et aux besoins
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    tension_entree_max_DC: {
      // Tension entrée max DC : Vérifier avec la tension totale des panneaux en série
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    courant_entree_max: {
      // Courant entrée max : Vérifier avec les panneaux
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    // Plage MPPT : doit être adaptée à la plage de tension et de courant des panneaux

    plage_MPPT_min: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    plage_MPPT_max: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    nbr_tracker_MPPT: {
      // Flexibilité dans la configuration PV
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rendement_max: {
      // Performance énergétique : Impact sur la production d'énergie
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    puissance_sortie_max: {
      // Puissance sortie max : Capacité réelle
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    type_sortie: {
      // Type de sortie : Compatibilité réseau
      type: DataTypes.ENUM("MonoPhasé", "Biphasé", "Triphasé"),
      allowNull: false,
    },
    dimension_longueur: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    dimension_largeur: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    dimension_hauteur: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    poids: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    prix: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    id_owner: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "onduleur_composant",
    timestamps: true,
    updatedAt: false,
  }
);

module.exports = OnduleurComposant;
