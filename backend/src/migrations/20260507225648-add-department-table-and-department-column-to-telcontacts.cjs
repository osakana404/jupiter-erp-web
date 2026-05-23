"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Departments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });

    await queryInterface.addColumn("TelContacts", "department_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "Departments", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Departments");
    await queryInterface.removeColumn("TelContacts", "department_id");
  },
};
