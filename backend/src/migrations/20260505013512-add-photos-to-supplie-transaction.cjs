"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Supplies", "photos", {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn("Transactions", "photos", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Supplies", "photos");
    await queryInterface.removeColumn("Transactions", "photos");
  },
};
