"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Part extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category", // алиас, чтобы обращаться part.category
      });
    }
  }
  Part.init(
    {
      name: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      categoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Part",
      tableName: "Parts",
      timestamps: true,
    },
  );
  return Part;
};
