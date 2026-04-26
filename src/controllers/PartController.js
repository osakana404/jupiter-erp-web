class PartController {
  constructor(partService) {
    this.partService = partService;
  }

  readAll = async (req, res, next) => {
    try {
      const result = await this.partService.showAll();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  create = async (req, res, next) => {
    try {
      const { name, quantity, description, categoryId } = req.body;

      if (!name) {
        res.status(400).json({ message: "Название запчасти обязательно" });
      }
      // вызываем сервис
      const result = this.partService.addPart(
        name,
        quantity,
        description,
        categoryId,
      );
      res.status(201).json({ message: `Запчасть ${name} успешно добавлена!` });
    } catch (error) {
      next(error);
    }
  };
  update = async (req, res, next) => {};
  delete = async (req, res, next) => {};
}

export default PartController;
