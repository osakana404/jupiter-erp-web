"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RepairDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // RepairDetail принадлежит одному Repair
      this.belongsTo(models.Repair, {
        foreignKey: "repair_id",
        as: "repair", // RepairDetail.getRepair()
      });
      this.belongsTo(models.RepairPrice, {
        foreignKey: "price_id",
        as: "price", // RepairDetail.getPrice()
      });
    }
  }
  RepairDetail.init(
    {
      repair_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price_fixed: {
        type: DataTypes.FLOAT,
        allowNull: false, // Обязательно!
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "RepairDetail",
      tableName: "RepairDetails", // Явно указываем таблицу
      timestamps: true,
    },
  );
  return RepairDetail;
};
