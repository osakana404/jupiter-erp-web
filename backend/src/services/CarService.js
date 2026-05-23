import models from "../models/index.cjs";
const { Car } = models;

class CarService {
  async getCars() {
    try {
      return await Car.findAll({
        order: [["model", "ASC"]], // Сортируем по модели для удобства
      });
    } catch (error) {
      throw error;
    }
  }

  async createCar(number, model, description, status) {
    if (!number || !model) {
      throw new Error("Гос.номер и модель машины обязательны!");
    }
    try {
      return await Car.create({
        number,
        model,
        description,
        status: status || "active", // Значение по умолчанию, если не передано
      });
    } catch (error) {
      throw error;
    }
  }

  async updateCar(id, updateData) {
    try {
      const car = await Car.findByPk(id);
      if (!car) throw new Error("Автомобиль не найден");

      // Обновляем поля
      await car.update({
        number: updateData.number || car.number,
        model: updateData.model || car.model,
        description: updateData.description || car.description,
        status: updateData.status || car.status,
      });

      return car;
    } catch (error) {
      throw error;
    }
  }

  async deleteCar(id) {
    try {
      const car = await Car.findByPk(id);
      if (!car) throw new Error("Автомобиль не найден");

      // ВНИМАНИЕ: Если на эту машину уже списывались запчасти (через FIFO систему),
      // БД может запретить удаление. Это правильно.
      await car.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default CarService;
