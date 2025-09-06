// src/models/config_load_profile.js

const { DataTypes, JSONB } = require("sequelize");
const { sequelize } = require("../config/db");


  const ConfigLoadProfile = sequelize.define('ConfigLoadProfile', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    configuration_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    mode: {
      type: DataTypes.ENUM('appliances', 'bill'),
      allowNull: false
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    Ej_day_wh: {
      type: DataTypes.NUMERIC,
      allowNull: false
    },
    Ej_night_wh: {
      type: DataTypes.NUMERIC,
      allowNull: false
    },
    Ej_total_wh: {
      type: DataTypes.NUMERIC,
      allowNull: false
    }
  }, {
    tableName: 'config_load_profiles',
    timestamps: true,
    underscored: true,
        indexes: [
      {
        unique: true,
        fields: ["configuration_id"],
      },
    ],
  });

  ConfigLoadProfile.associate = models => {
    ConfigLoadProfile.belongsTo(models.Configuration, {
      foreignKey: 'configuration_id',
      onDelete: 'CASCADE'
    });
  };


module.exports = ConfigLoadProfile;