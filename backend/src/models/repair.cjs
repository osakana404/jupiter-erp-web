"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Repair extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.RepairDetail, {
        foreignKey: "repair_id",
        as: "details", // repair.getDetails()
      });
    }
  }
  Repair.init(
    {
      fio: DataTypes.STRING,
      auto: DataTypes.STRING,
      number: DataTypes.STRING,
      tel: DataTypes.STRING,
      passport: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Repair",
      tableName: "Repairs", // Явно указываем таблицу
      timestamps: true,
    },
  );
  return Repair;
};
