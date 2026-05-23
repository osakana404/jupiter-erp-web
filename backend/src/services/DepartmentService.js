import models from "../models/index.cjs";
const { Department, TelContact } = models;

class DepartmentService {
  async showAllDepartments() {
    try {
      const result = await Department.findAll({
        include: [{ model: TelContact, as: "contacts" }],
      });
      return result;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async createDepartment(name) {
    try {
      const result = await Department.create({ name: name });
      return result;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async updateDepartment(id, name) {
    try {
      const department = await Department.findByPk(id);
      if (!department) {
        throw new Error(`Отдел с id=${id} не найден`);
      }

      await department.update({ name });
      return department;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async deleteDepartment(id) {
    try {
      const department = await Department.findByPk(id);
      if (!department) {
        throw new Error(`Отдел с id=${id} не найден`);
      }

      // Логика удаления: записи в TelContact получат department_id = null
      // (если в миграции не указано иное)
      await department.destroy();
      return true;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
}

export default DepartmentService;
