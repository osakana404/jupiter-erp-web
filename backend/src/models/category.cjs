"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Part, {
        foreignKey: "categoryId",
        as: "parts", // алиас, чтобы обращаться category.parts
      });
    }
  }
  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false, // Как и в миграции
        unique: true, // Чтобы данные были консистентны
      },
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "Categories", // Явно указываем имя из миграции
      timestamps: true, // Подключаем использование createdAt/updatedAt
    },
  );
  return Category;
};
