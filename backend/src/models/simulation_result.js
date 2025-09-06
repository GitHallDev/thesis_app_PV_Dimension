// src/models/simulation_result.js
const SimulationRun = require("./simulation_run")
const { DataTypes, JSONB } = require("sequelize");
const { sequelize } = require("../config/db");

const SimulationResult = sequelize.define(
  "SimulationResult",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    simulation_run_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    kwh_year: {
      type: DataTypes.FLOAT,
    },
    pr_ratio: {
      type: DataTypes.FLOAT,
    },
    dc_ac_ratio_real: {
      type: DataTypes.FLOAT,
    },
    losses_breakdown: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    monthly_kwh: {
      type: DataTypes.ARRAY(DataTypes.FLOAT), // 12 valeurs
    },
    economics: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    p50_kwh: {
      type: DataTypes.FLOAT,
    },
    p90_kwh: {
      type: DataTypes.FLOAT,
    },
  },
  {
    tableName: "simulation_results",
    timestamps: true,
    underscored: true,
  }
);
SimulationRun.hasOne(SimulationResult,{foreignKey:"simulation_run_id"});
// SimulationResult.belongsTo(SimulationRun,{foreignKey:"simulation_run_id"});
module.exports = SimulationResult;
