import models from "../models/index.cjs";
const { Supplie, Batch, Transaction, sequelize, Part } = models;

class SupplyService {
  async createSupply(data, userId, photoPaths = []) {
    const t = await sequelize.transaction();
    try {
      const { agentId, docNumber, date, items } = data;

      // ВАЖНО: Если сделать обязательным,  проверка:
      // if (photoPaths.length === 0) throw new Error("Фото накладной обязательно");

      const totalSum = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const supplie = await Supplie.create(
        {
          agentId,
          docNumber,
          date: date || new Date(),
          totalSum,
          userId,
          photos: photoPaths, // Сохраняем массив путей
        },
        { transaction: t },
      );

      for (const item of items) {
        // 1. Создаем партию
        // ВАЖНО: Убедись, что в Batch модель поле называется currentQuantity или quantity
        const batch = await Batch.create(
          {
            partId: item.partId,
            supplieId: supplie.id,
            currentQuantity: item.quantity, // В твоей модели Batch было currentQuantity
            initialQuantity: item.quantity,
            price: item.price,
          },
          { transaction: t },
        );

        // 2. Регистрируем транзакцию
        await Transaction.create(
          {
            partId: item.partId,
            supplieId: supplie.id,
            batchId: batch.id,
            type: "increment", // ИСПРАВЛЕНО: согласно твоему ENUM в модели
            quantity: item.quantity,
            price: item.price, // ДОБАВЛЕНО: обязательно по модели
            sum: item.price * item.quantity, // ДОБАВЛЕНО: обязательно по модели
            userId: userId,
          },
          { transaction: t },
        );
      }

      await t.commit();
      return supplie;
    } catch (error) {
      await t.rollback();
      console.error("ОШИБКА ПРИ СОЗДАНИИ ПРИХОДА:", error); // <-- ДОБАВЬ ЭТО
      throw error;
    }
  }

  async getSupplies() {
    return await Supplie.findAll({
      include: [
        { model: models.Agent, as: "agent" },
        { model: models.User, as: "user", attributes: ["login"] },
        {
          model: Batch,
          as: "batches",
          include: [{ model: Part, as: "part" }], // Чтобы увидеть названия запчастей
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }
}

export default SupplyService;
