"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supplie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Agent, {
        foreignKey: "agentId",
        as: "agent", // supplie.agent
      });
    }
  }
  Supplie.init(
    {
      agentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Suppliers",
          key: "id",
        },
      },
      docNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      totalSum: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Supplie",
      tableName: "Supplies",
      timestamps: true,
    },
  );
  return Supplie;
};
