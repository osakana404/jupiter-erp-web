import models from "../models/index.cjs";
const { Category } = models;

class CategoryService {
  async showAll() {
    try {
      return await Category.findAll({
        order: [["name", "ASC"]],
      });
    } catch (error) {
      throw error;
    }
  }

  async create(name) {
    if (!name) throw new Error("Имя категории обязательно");
    try {
      return await Category.create({ name: name });
    } catch (error) {
      throw error;
    }
  }

  async update(id, name) {
    if (!name) throw new Error("Новое имя категории обязательно");
    try {
      const category = await Category.findByPk(id);
      if (!category) throw new Error("Категория не найдена");

      category.name = name;
      await category.save();
      return category;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const category = await Category.findByPk(id);
      if (!category) throw new Error("Категория не найдена");

      // ВАЖНО: Если к категории привязаны запчасти,
      // Sequelize может выдать ошибку (зависит от настроек foreignKey)
      await category.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default CategoryService;
