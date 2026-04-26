"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Каждая транзакция принадлежит какому-то пользователю
      this.belongsTo(models.User, { foreignKey: "userId", as: "author" });
      this.belongsTo(models.Part, { foreignKey: "partId", as: "part" });
      this.belongsTo(models.Car, { foreignKey: "carId", as: "car" });
      this.belongsTo(models.Supplie, {
        foreignKey: "supplieId",
        as: "supplies",
      });
    }
  }
  Transaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      partId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      carId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Только для списания
      },
      supplyId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Только для прихода
      },
      type: {
        type: DataTypes.ENUM("increment", "decrement"),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT, // Цена за единицу в этой операции
        allowNull: false,
      },
      sum: {
        type: DataTypes.FLOAT, // Итого: quantity * price
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true, // Можно добавить причину списания или заметку
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // true, чтобы старые записи не выдали ошибку
        references: { model: "User", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "Transactions",
      timestamps: true,
    },
  );
  return Transaction;
};
