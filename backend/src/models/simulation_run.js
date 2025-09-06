// src/models/simulation_run.js

const { DataTypes, JSONB } = require("sequelize");
const { sequelize } = require("../config/db");

const SimulationRun = sequelize.define(
  "SimulationRun",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    configuration_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "queued",
        "running",
        "succeeded",
        "failed",
        "canceled"
      ),
      defaultValue: "queued",
    },
    engine_version: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "v1.0", // à incrémenter plus tard
    },
    input_checksum: {
      type: DataTypes.STRING,
    },
    pvgis_request: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    started_at: {
      type: DataTypes.DATE,
    },
    finished_at: {
      type: DataTypes.DATE,
    },
    duration_ms: {
      type: DataTypes.INTEGER,
    },
    messages: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    tableName: "simulation_runs",
    timestamps: true,
    underscored: true,
  }
);

module.exports = SimulationRun;
