"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Batch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Supplie, {
        // одна поставка = много партий
        foreignKey: "supplieId",
        as: "supplie", // алиас, чтобы обращаться part.category
      });
      this.belongsTo(models.Part, {
        // Одна запчасть может приходить во многих разных партиях.
        foreignKey: "partId",
        as: "part",
      });
    }
  }
  Batch.init(
    {
      partId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      supplieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      initialQuantity: {
        // сколько купили ИЛИ почем приехала партия
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currentQuantity: {
        // текущий остаток из партии
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0, // Количество не может быть отрицательным
        },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "empty"),
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "Batch",
      tableName: "Batches",
      timestamps: true,
    },
  );
  return Batch;
};
