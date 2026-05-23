import models from "../models/index.cjs";
const { Part, Category } = models;

class PartService {
  async showAll() {
    try {
      return await Part.findAll({
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["name"],
          },
        ],
        order: [["name", "ASC"]],
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addPart(name, quantity, description, categoryId) {
    if (!name) throw new Error("Имя обязательно!");
    try {
      return await Part.create({
        name: name,
        quantity: 0,
        description: description,
        categoryId: categoryId,
      });
    } catch (error) {
      throw error;
    }
  }

  async updatePart(id, updateData) {
    try {
      const part = await Part.findByPk(id);
      if (!part) return null;

      // Обновляем поля, если они переданы в updateData
      await part.update({
        name: updateData.name || part.name,
        description: updateData.description || part.description,
        categoryId: updateData.categoryId || part.categoryId,
        // quantity обычно меняется через поступления (supplies),
        // но если нужно менять вручную — добавь и его
      });

      return part;
    } catch (error) {
      throw error;
    }
  }

  async deletePart(id) {
    try {
      const part = await Part.findByPk(id);
      if (part) {
        await part.destroy();
      }
    } catch (error) {
      throw error;
    }
  }
}

export default PartService;
