"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RepairPrice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.RepairDetail, {
        foreignKey: "price_id",
        as: "used_in_repairs", // price.getUsedInRepairs()
      });
    }
  }
  RepairPrice.init(
    {
      name: DataTypes.STRING,
      description: { type: DataTypes.TEXT, allowNull: true },
      price: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "RepairPrice",
      tableName: "RepairPrices", // Явно указываем таблицу
      timestamps: true,
    },
  );
  return RepairPrice;
};
