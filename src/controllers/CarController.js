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
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default CarController;
