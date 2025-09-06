const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const RegulateurComposant = sequelize.define(
  "RegulateurComposant",
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
    dimension_longueur: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dimension_largeur: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dimension_hauteur: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    poids: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    prix:{
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    id_owner: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "regulateur_composant",
    timestamps: true,
    updatedAt: false,
  }
);

module.exports = RegulateurComposant;
