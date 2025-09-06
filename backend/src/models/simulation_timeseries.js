// src/models/Simulation_time_series.js

const { DataTypes, JSONB } = require("sequelize");
const { sequelize } = require("../config/db");

const SimulationTimeseries = sequelize.define(
  "SimulationTimeseries",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    simulation_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    ts: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    poa_irr_wm2: {
      type: DataTypes.FLOAT,
    },
    t_cell_c: {
      type: DataTypes.FLOAT,
    },
    e_ac_wh: {
      type: DataTypes.FLOAT,
    },
  },
  {
    tableName: "simulation_timeseries",
    timestamps: false,
    underscored: true,  
  }
);

module.exports=SimulationTimeseries;
