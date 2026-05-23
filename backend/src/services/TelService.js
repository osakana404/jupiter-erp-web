import models from "../models/index.cjs";
const { TelContact, Department } = models;

class TelService {
  async showAllContacts() {
    try {
      const result = await TelContact.findAll({
        include: [
          {
            model: Department,
            as: "department",
            attributes: ["name"], // Достаем только имя департамента
          },
        ],
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async createContact(
    name,
    position,
    internal_tel,
    city_tel,
    mobile_tel,
    department_id,
  ) {
    try {
      // Приводим к числу на случай, если пришла строка "1"
      const idToFind = parseInt(department_id);
      const department = await Department.findByPk(idToFind);
      if (!department) {
        // Выведи в консоль, что именно ты ищешь, чтобы проверить в БД
        console.log("Пытаемся найти отдел с ID:", idToFind);
        throw new Error(`Не найден отдел с таким id (${idToFind})`);
      }
      const result = await TelContact.create({
        name,
        position,
        internal_tel,
        city_tel,
        mobile_tel,
        department_id: department.id,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteContact(id) {
    try {
      const target = await TelContact.findByPk(id);
      if (!target) throw new Error("Контакт не найден!");
      await target.destroy();
      return true;
    } catch (error) {
      console.error("Ошибка при удалении в БД:", error.message); // Логируем для себя
      throw error;
    }
  }

  async updateContact(id, data) {
    try {
      const {
        name,
        position,
        internal_tel,
        city_tel,
        mobile_tel,
        department_id,
      } = data;

      // 1. Ищем контакт
      const contact = await TelContact.findByPk(id);
      if (!contact) {
        throw new Error("Контакт не найден!");
      }

      // 2. Если прилетел новый department_id, проверяем, есть ли такой отдел
      if (department_id) {
        const department = await Department.findByPk(department_id);
        if (!department) {
          throw new Error("Указанный отдел не существует");
        }
      }

      // 3. Обновляем поля.
      // Sequelize обновит только те поля, которые переданы (не undefined)
      await contact.update({
        name: name || contact.name,
        position: position || contact.position,
        internal_tel: internal_tel || contact.internal_tel,
        city_tel: city_tel || contact.city_tel,
        mobile_tel: mobile_tel || contact.mobile_tel,
        department_id: department_id || contact.department_id,
      });

      return contact;
    } catch (error) {
      console.error("Ошибка при ОБНОВЛЕНИИ в БД:", error.message);
      throw error;
    }
  }
}

export default TelService;
