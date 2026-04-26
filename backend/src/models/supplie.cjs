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
      this.hasMany(models.Batch, {
        // у поставки есть много партий
        foreignKey: "supplieId",
        as: "batches",
      });
      this.hasMany(models.Transaction, {
        // у поставки есть много партий
        foreignKey: "supplieId",
        as: "transactions",
      });
    }
  }
  Supplie.init(
    {
      agentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Agent",
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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "User", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
