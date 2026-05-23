"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TelContact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Department, {
        foreignKey: "department_id",
        as: "department", // telcontact.department
      });
    }
  }
  TelContact.init(
    {
      name: DataTypes.STRING,
      position: DataTypes.STRING,
      internal_tel: DataTypes.STRING, // Внутренний
      city_tel: DataTypes.STRING, // Городской
      mobile_tel: DataTypes.STRING, // Сотовый
      department_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TelContact",
      tableName: "TelContacts", // Явно указываем имя из миграции
      timestamps: true, // Подключаем использование createdAt/updatedAt
    },
  );
  return TelContact;
};
