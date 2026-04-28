import models from "../models/index.cjs";
import { Op } from "sequelize"; // Операторы для фильтрации
const { Transaction, Part, User, Car, Supplie, Agent } = models;

class TransactionService {
  async getAllTransactions(filters = {}) {
    const { startDate, endDate } = filters;

    // Формируем условие where для дат
    const whereCondition = {};
    // Важно: проверяем наличие именно значений, а не просто ключей
    if (startDate && endDate) {
      whereCondition.date = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      whereCondition.date = { [Op.gte]: startDate };
    } else if (endDate) {
      whereCondition.date = { [Op.lte]: endDate };
    }

    return await Transaction.findAll({
      where: whereCondition,
      order: [["date", "DESC"]],
      include: [
        { model: Part, as: "part", attributes: ["name"] },
        { model: User, as: "user", attributes: ["login"] },
        { model: Car, as: "car", attributes: ["model", "number"] },
        {
          model: Supplie,
          as: "supplies",
          include: [{ model: Agent, as: "agent", attributes: ["name"] }],
        },
      ],
    });
  }
}

export default TransactionService;
