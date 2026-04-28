import models from "../models/index.cjs";
const { Batch, Part, Supplie, Agent, Category } = models;

class BatchService {
  async getAllBatches() {
    return await Batch.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Part,
          as: "part",
          // Убираем oem, так как его нет в модели Part
          attributes: ["name", "description"],
          include: [{ model: Category, as: "category", attributes: ["name"] }],
        },
        {
          model: Supplie,
          as: "supplie",
          include: [{ model: Agent, as: "agent", attributes: ["name"] }],
        },
      ],
    });
  }
}

export default BatchService;
