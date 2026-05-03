import models from "../models/index.cjs";
const { Repair, RepairDetail, RepairPrice } = models;

class RepairService {
  async showAllPrices() {
    try {
      const allPrices = await RepairPrice.findAll();
      return allPrices;
    } catch (error) {
      throw error;
    }
  }

  async addPrice(name, description, price) {
    try {
      const newPrice = await RepairPrice.create({
        name: name,
        description: description,
        price: price,
      });
      return newPrice;
    } catch (error) {
      throw error;
    }
  }

  // клиенты
  async showAllClients() {
    try {
      // Добавляем include, чтобы видеть услуги при просмотре
      const allClients = await Repair.findAll({
        include: [
          {
            model: RepairDetail,
            as: "details",
            include: [
              {
                model: RepairPrice,
                as: "price",
              },
            ],
          },
        ],
      });
      return allClients;
    } catch (error) {
      throw error;
    }
  }

  async addRepairClient(fio, auto, number, tel, passport, prices) {
    // Используем транзакцию, чтобы если что-то пошло не так - откатить всё
    const transaction = await models.sequelize.transaction();

    try {
      // 1. Создаем клиента (ремонт)
      const newClient = await Repair.create(
        {
          fio: fio,
          auto: auto,
          number: number,
          tel: tel,
          passport: passport,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { transaction },
      );

      // 2. Проверяем, что prices - это массив
      if (!Array.isArray(prices) || prices.length === 0) {
        throw new Error("Не передан массив услуг или он пуст");
      }

      // 3. Для каждой услуги получаем актуальную цену

      for (const item of prices) {
        // Находим цену в прайсе
        const priceItem = await RepairPrice.findByPk(item.price_id, {
          transaction,
        });

        if (!priceItem) {
          throw new Error(`Услуга с id ${item.price_id} не найдена`);
        }

        // Создаем запись в RepairDetail
        const detail = await RepairDetail.create(
          {
            repair_id: newClient.id,
            price_id: item.price_id,
            price_fixed: priceItem.price, // Сохраняем цену на момент ремонта!
            quantity: item.quantity || 1,
          },
          { transaction },
        );
      }

      // Подтверждаем транзакцию
      await transaction.commit();

      // Возвращаем клиента с его услугами
      const result = await Repair.findByPk(newClient.id, {
        include: [
          {
            model: RepairDetail,
            as: "details",
            include: [
              {
                model: RepairPrice,
                as: "price",
              },
            ],
          },
        ],
      });

      return result;
    } catch (error) {
      // Откатываем транзакцию при ошибке
      await transaction.rollback();
      throw error;
    }
  }
}

export default RepairService;
