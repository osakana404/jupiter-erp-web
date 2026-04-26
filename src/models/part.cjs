"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Part extends Model {
    static associate(models) {
      // Sequelize сам поймет все правила связей отсюда
      this.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
      this.hasMany(models.Batch, {
        foreignKey: "partId",
        as: "batches",
      });
    }
  }

  Part.init(
    {
      name: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      categoryId: DataTypes.INTEGER, // Просто тип, остальное в associate
    },
    {
      sequelize,
      modelName: "Part",
      tableName: "Parts", // Явно указываем таблицу
      timestamps: true,
    },
  );
  return Part;
};
