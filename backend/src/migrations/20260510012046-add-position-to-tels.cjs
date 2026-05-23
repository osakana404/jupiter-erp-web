"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("TelContacts", "position", {
      type: Sequelize.STRING,
      allowNull: true, // Должность может быть пустой
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("TelContacts", "position");
  },
};
