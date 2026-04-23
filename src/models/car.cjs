"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Car.init(
    {
      number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Номер машины обычно уникален
      },
      model: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "Без описания",
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "в работе", // Например: в работе, ремонт, списана
      },
    },
    {
      sequelize,
      modelName: "Car",
      tableName: "Cars",
      timestamps: true,
    },
  );
  return Car;
};
