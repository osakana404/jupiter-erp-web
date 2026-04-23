import models from "../models/index.cjs";
const { Car } = models;

class CarService {
  async getCars() {
    const allCars = await Car.findAll();
    return allCars;
  }

  async createCar(number, model, description, status) {
    if (!number || !model) {
      throw new Error("Гос.номер и модель машины не должны быть пустыми!");
    }
    const newCar = await Car.create({
      number: number,
      model: model,
      description: description,
      status: status,
    });
    return newCar;
  }
}

export default CarService;
