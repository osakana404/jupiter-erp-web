import models from "../models/index.cjs";
const { Batch, Transaction, sequelize } = models;

class DisburseService {
  async createMassDisburse(data, userId) {
    const { carId, items, comment } = data; // items - это массив запчастей
    const t = await sequelize.transaction();

    try {
      for (const item of items) {
        const { batchId, partId, quantity } = item;

        // 1. Ищем партию
        const batch = await Batch.findByPk(batchId, { transaction: t });
        if (!batch) throw new Error(`Партия #${batchId} не найдена`);
        if (batch.currentQuantity < quantity) {
          throw new Error(
            `Недостаточно в партии #${batchId}. Остаток: ${batch.currentQuantity}`,
          );
        }

        // 2. Уменьшаем остаток
        const newQty = batch.currentQuantity - quantity;
        await batch.update(
          {
            currentQuantity: newQty,
            status: newQty === 0 ? "empty" : "active",
          },
          { transaction: t },
        );

        // 3. Создаем транзакцию (связываем со старой накладной через supplieId)
        await Transaction.create(
          {
            partId,
            carId,
            batchId,
            supplieId: batch.supplieId, // Связка с накладной
            type: "decrement",
            quantity,
            price: batch.price,
            sum: batch.price * quantity,
            userId,
            comment: comment || "Массовое списание",
          },
          { transaction: t },
        );
      }

      await t.commit();
      return { message: "Все запчасти успешно списаны" };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

export default DisburseService;
