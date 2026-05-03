"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RepairDetails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      repair_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Repairs", // Имя таблицы запчастей
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      price_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "RepairPrices", // Имя таблицы запчастей
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT", // Не даем удалить прайс, если используется
      },
      price_fixed: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("RepairDetails");
  },
};
