"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Parts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.TEXT,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Categories", // Имя таблицы в БД (обычно во множественном числе)
          key: "id", // Поле, на которое ссылаемся
        },
        onUpdate: "CASCADE", // Если ID категории изменится, он обновится и здесь
        onDelete: "SET NULL", // Если категорию удалят, поле станет пустой (null)
        allowNull: true, // Или false, если запчасть обязана иметь категорию
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
    await queryInterface.dropTable("Parts");
  },
};
