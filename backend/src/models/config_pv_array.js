// src/models/config_pv_array.js

const { DataTypes, JSONB } = require("sequelize");
const { sequelize } = require("../config/db");

const ConfigPVArray = sequelize.define(
  "ConfigPVArray",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    configuration_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    array_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    module_catalog: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    module_datasheet: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    module_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    module_power_w: {
      type: DataTypes.NUMERIC,
      allowNull: false,
    },
    modules_in_series: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    strings_in_parallel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tilt_deg: {
      type: DataTypes.NUMERIC,
      allowNull: false,
    },
    azimuth_deg: {
      type: DataTypes.NUMERIC,
      allowNull: false,
    },
    total_power_w: {
      type: DataTypes.NUMERIC,
      allowNull: false,
    },
    sahding: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    tableName: "config_pv_arrays",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["configuration_id", "array_name"],
      },
    ],
  }
);
