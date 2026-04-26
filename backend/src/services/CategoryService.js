import models from "../models/index.cjs";
const { Category } = models;

class CategoryService {
  async showAll() {
    try {
      const allCategories = await Category.findAll({
        order: [["name", "ASC"]],
      });
      return allCategories;
    } catch (error) {
      throw error;
    }
  }

  async create(name) {
    try {
      if (!name) {
        throw new Error("Ну имя то передай категории");
      }
      const newCategory = await Category.create({ name: name });
      return newCategory;
    } catch (error) {
      next(error);
    }
  }
}

export default CategoryService;
