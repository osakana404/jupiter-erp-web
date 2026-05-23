"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("TelContacts", "internal_tel", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("TelContacts", "city_tel", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("TelContacts", "mobile_tel", {
      type: Sequelize.STRING,
    });
    // Если хочешь удалить старую колонку tel:
    await queryInterface.removeColumn("TelContacts", "tel");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("TelContacts", "internal_tel");
    await queryInterface.removeColumn("TelContacts", "city_tel");
    await queryInterface.removeColumn("TelContacts", "mobile_tel");
    await queryInterface.addColumn("TelContacts", "tel", {
      type: Sequelize.STRING,
    });
  },
};
