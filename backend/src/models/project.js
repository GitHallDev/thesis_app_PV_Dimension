const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Project = sequelize.define(
  "project",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Génère un UUID par défaut
      primaryKey: true,
    },
    profil_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    project_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    latitude: { type: DataTypes.FLOAT, allowNull: false },
    hauteur: { type: DataTypes.FLOAT, allowNull: false },
    id_owner: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(["En cours", "Terminé"]),
      allowNull: false,
    },
  },
  {
    tableName: "project",
    timestamps: true,
    updatedAt: false,
  }
);

module.exports = Project;
