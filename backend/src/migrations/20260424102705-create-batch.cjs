"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Batches", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      partId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Parts", // Имя таблицы запчастей
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      supplieId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Supplies", // Имя таблицы поставок
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      initialQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      currentQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("active", "empty"),
        defaultValue: "active",
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
    await queryInterface.dropTable("Batches");
    // Удаляем ENUM при откате миграции (актуально для PostgreSQL)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Batches_status";',
    );
  },
};
