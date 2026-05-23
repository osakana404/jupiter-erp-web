"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Agent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Supplie, {
        foreignKey: "agentId",
        as: "supplies", // agents.supplies
      });
    }
  }
  Agent.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      inn: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Agent",
      tableName: "Agents", // Явно указываем имя из миграции
      timestamps: true, // Подключаем использование createdAt/updatedAt
    },
  );
  return Agent;
};
