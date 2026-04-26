"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      partId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      carId: {
        type: Sequelize.INTEGER,
        allowNull: true, // Только для decrement
      },
      supplieId: {
        type: Sequelize.INTEGER,
        allowNull: true, // Только для increment
      },
      type: {
        type: Sequelize.ENUM("increment", "decrement"),
        defaultValue: "increment",
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      sum: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true, // Можно добавить причину списания или заметку
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
    await queryInterface.dropTable("Transactions");
  },
};
