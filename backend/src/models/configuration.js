// src/models/configuration.js

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Configuration = sequelize.define(
  "Configuration",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM(
        "draft",
        "ready",
        "queued",
        "running",
        "succeeded",
        "failed",
        "archived"
      ),
      defaultValue: "draft",
    },
    is_baseline: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    based_on_configuration_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    inputs: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    notes: {
      type: DataTypes.TEXT,
    },
    input_checksum: {
      type: DataTypes.STRING,
    },
    locked_at: {
      type: DataTypes.DATE,
    },
    locked_by: {
      type: DataTypes.UUID,
    },
  },
  {
    tableName: "configurations",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["project_id", "name"],
      },
    ],
  }
);

module.exports = Configuration;
