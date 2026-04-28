import models from "../models/index.cjs";
const { Batch, Transaction, Car, sequelize, Supplie, Part } = models;
import { Op } from "sequelize";

class StatsService {
  async getDashboardStats() {
    // 1. Общая стоимость склада (сумма всех активных партий)
    const stockData = await Batch.findAll({
      where: { currentQuantity: { [Op.gt]: 0 } },
      attributes: [
        [
          sequelize.fn("SUM", sequelize.literal("currentQuantity * price")),
          "totalValue",
        ],
      ],
    });

    // 2. Количество приходов и списаний
    const txStats = await Transaction.findAll({
      attributes: [
        "type",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("sum")), "totalSum"],
      ],
      group: ["type"],
    });

    // 3. Траты по конкретным машинам
    // 3. Траты по машинам + детализация
    const carStats = await Transaction.findAll({
      where: { type: "decrement", carId: { [Op.ne]: null } },
      attributes: [
        "carId",
        [sequelize.fn("SUM", sequelize.col("sum")), "spent"],
      ],
      include: [
        { model: Car, as: "car", attributes: ["model", "number"] },
        // Добавляем детализацию внутри каждой группы (или можно оставить только группировку,
        // но для простоты Dashboard вытянем транзакции отдельно)
      ],
      group: ["carId", "car.id"],
      order: [[sequelize.literal("spent"), "DESC"]],
    });

    // Дополнительно вытянем все списания с запчастями для фильтрации на фронте
    const detailedTransactions = await Transaction.findAll({
      where: { type: "decrement", carId: { [Op.ne]: null } },
      include: [
        { model: models.Part, as: "part", attributes: ["name"] },
        {
          model: models.Supplie,
          as: "supplies",
          attributes: ["docNumber"],
          include: [{ model: models.Agent, as: "agent", attributes: ["name"] }],
        },
      ],
      order: [["date", "DESC"]],
    });

    return {
      warehouseValue: parseFloat(stockData[0]?.dataValues.totalValue || 0),
      transactions: txStats,
      byCars: carStats,
      details: detailedTransactions, // Передаем детали в общий объект
    };
  }
}

export default StatsService;
