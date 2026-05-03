class RepairController {
  constructor(repairService) {
    this.repairService = repairService;
  }

  // прайс
  readPrices = async (req, res, next) => {
    try {
      const result = await this.repairService.showAllPrices();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  createNewPrice = async (req, res, next) => {
    try {
      const { name, description, price } = req.body;
      if (!name || !price) {
        res
          .status(401)
          .json({ message: "Имя и Цена обязательны к заполнению!" });
      }
      const result = await this.repairService.addPrice(
        name,
        description,
        price,
      );
      res
        .status(201)
        .json({ message: `Прайс ${result.name} успешно создана!` });
    } catch (error) {
      next(error);
    }
  };
  // клиенты
  readClients = async (req, res, next) => {
    try {
      const result = await this.repairService.showAllClients();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  createNewClient = async (req, res, next) => {
    try {
      const { fio, auto, number, tel, passport } = req.body;
      if (!fio || !auto || !number || !tel) {
        res.status(401).json({
          message: "ФИО, АВТО, ГОС.НОМЕР, ТЕЛЕФОН - обязательны к заполнению!",
        });
      }
      const result = await this.repairService.addRepairClient(
        fio,
        auto,
        number,
        tel,
        passport,
      );
      res.status(201).json({ message: `Клиент ${result.fio} успешно создан` });
    } catch (error) {
      next(error);
    }
  };
}

export default RepairController;
