// src/models/index.js

const Configuration = require("./configuration");
const SimulationTimeseries = require("./simulation_timeseries");
const SimulationRun = require("./simulation_run");
const Project = require("./project");
const SimulationResult = require("./simulation_result");

Configuration.hasMany(SimulationRun, { foreignKey: "configuration_id" });
SimulationRun.belongsTo(Configuration, { foreignKey: "configuration_id" });

SimulationRun.hasOne(SimulationResult,{foreignKey:"simulation_run_id"});
SimulationResult.belongsTo(SimulationRun,{foreignKey:"simulation_run_id"});

SimulationRun.hasMany(SimulationTimeseries,{foreignKey:"simulation_run_id"});
SimulationTimeseries.belongsTo(SimulationRun,{foreignKey:"simulation_run_id"});
