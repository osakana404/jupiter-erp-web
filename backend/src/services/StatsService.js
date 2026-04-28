import models from "../models/index.cjs";
const { Batch, Transaction, Car, sequelize } = models;
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
    const carStats = await Transaction.findAll({
      where: { type: "decrement", carId: { [Op.ne]: null } },
      attributes: [[sequelize.fn("SUM", sequelize.col("sum")), "spent"]],
      include: [{ model: Car, as: "car", attributes: ["model", "number"] }],
      group: ["carId", "car.id"],
      order: [[sequelize.literal("spent"), "DESC"]],
    });

    return {
      warehouseValue: parseFloat(stockData[0]?.dataValues.totalValue || 0),
      transactions: txStats,
      byCars: carStats,
    };
  }
}

export default StatsService;
