"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Получаем информацию о колонках в таблице Supplies
    const tableInfo = await queryInterface.describeTable("Supplies");

    // 2. Если колонки userId еще нет — создаем её
    if (!tableInfo.userId) {
      await queryInterface.addColumn("Supplies", "userId", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users", // ВАЖНО: Множественное число, как в БД
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    } else {
      // Если колонка УЖЕ есть, мы ничего не делаем, чтобы не вызвать ошибку duplicate column.
      // SQLite не позволяет легко "перепривязать" существующую колонку через миграцию.
      console.log(
        "Колонка userId уже существует в Supplies, пропускаем создание.",
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    // На случай отката — удаляем колонку
    const tableInfo = await queryInterface.describeTable("Supplies");
    if (tableInfo.userId) {
      await queryInterface.removeColumn("Supplies", "userId");
    }
  },
};
