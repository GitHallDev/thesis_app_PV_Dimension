const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const PVModuleComposant = sequelize.define(
  "PVModuleComposant",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Génère un UUID par défaut
      primaryKey: true,
    },
    fabricant: {
      // Fabricant : Connaître le fabricant pour compatibilité et SAV
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      // Référence / Modèle : Identifier le panneau dans la BDD
      type: DataTypes.STRING,
      allowNull: false,
    },
    technologie: {
      // Type de cellule : Impact sur rendement et comportement par faible luminosité
      type: DataTypes.ENUM(
        "Monocristallin",
        "Polycristallin",
        "CIS/CIGS",
        "CdTe",
        "Organique"
      ),
      allowNull: false,
    },
    puissance_crete: {
      // Puissance crête (Pmax) : Base du calcul de production d’énergie
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    tension_puissance_maximale: {
      // Tension au point de puissance max (Vmp) : Sert à dimensionner le nombre de panneaux en série
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    courant_puissance_maximale: {
      // Courant au point de puissance max (Imp) : Sert à dimensionner la section de câble et vérifier les limites de l’onduleur
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    tension_a_vide: {
      // Tension à vide (Voc) :Important pour vérifier que la tension totale en série ne dépasse pas la tension max de l’onduleur/régulateur
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    courant_court_circuit: {
      // Courant à court circuit (Isc) : Courant en régime continu, utilisé pour calculer la puissance de fonctionnement
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    tolerance_puissance: {
      // Tolérance de puissance (%Pmax) : Précision sur la puissance réelle par rapport à la valeur nominale
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    nombre_cellule: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dimension_module_longueur: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    dimension_module_largeur: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    dimension_module_hauteur: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    coefficient_temperature_courant: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    coefficient_temperature_tension: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    coefficient_temperature_puissance: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    plage_temperature_fonctionnement: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    poids_module: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    rendement_cellule: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    rendement_module: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    condition_standard_test: {
      type: DataTypes.STRING,
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
    tableName: "pv_module_composant",
    timestamps: true,
    updatedAt: false,
  }
);

module.exports = PVModuleComposant;
