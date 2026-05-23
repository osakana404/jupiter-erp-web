class CarController {
  constructor(carService) {
    this.carService = carService;
  }

  show = async (req, res, next) => {
    try {
      const result = await this.carService.getCars();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const { number, model, description, status } = req.body;
      const result = await this.carService.createCar(
        number,
        model,
        description,
        status,
      );
      res.status(201).json({ message: "Автомобиль успешно добавлен", result });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const result = await this.carService.updateCar(id, updateData);
      res.status(200).json({ message: "Данные автомобиля обновлены", result });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.carService.deleteCar(id);
      res.status(200).json({ message: "Автомобиль удален из базы" });
    } catch (error) {
      next(error);
    }
  };
}

export default CarController;
