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
      const allClients = await Repair.findAll();
      return allClients;
    } catch (error) {
      throw error;
    }
  }

  async addRepairClient(fio, auto, number, tel, passport) {
    try {
      const newClient = await Repair.create({
        fio: fio,
        auto: auto,
        number: number,
        tel: tel,
        passport: passport,
      });
      return newClient;
    } catch (error) {
      throw error;
    }
  }

  //прайс
}

export default RepairService;
