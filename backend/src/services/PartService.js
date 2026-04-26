import models from "../models/index.cjs";
const { Part, Category } = models;

class PartService {
  async showAll() {
    try {
      const allParts = await Part.findAll({
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["name"], // выберет только имя категории, без лишнего мусора
          },
        ],
        order: [["name", "ASC"]],
      });
      return allParts;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async addPart(name, quantity, description, categoryId) {
    if (!name) {
      throw new Error("Имя обязательно!");
    }
    try {
      const newPart = await Part.create({
        name: name,
        quantity: 0, // всегда 0 пока не сделаем supplie
        description: description,
        categoryId: categoryId,
      });
      return newPart;
    } catch (error) {
      throw error;
    }
  }
}

export default PartService;
