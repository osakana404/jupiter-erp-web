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
        return res
          .status(400)
          .json({ message: "Название запчасти обязательно" });
      }

      // Добавлен await, чтобы дождаться создания
      const result = await this.partService.addPart(
        name,
        quantity,
        description,
        categoryId,
      );
      res
        .status(201)
        .json({ message: `Запчасть ${name} успешно добавлена!`, data: result });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params; // Берем ID из URL: /parts/:id
      const updateData = req.body;

      const updatedPart = await this.partService.updatePart(id, updateData);

      if (!updatedPart) {
        return res.status(404).json({ message: "Запчасть не найдена" });
      }

      res.status(200).json({ message: "Данные обновлены", data: updatedPart });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.partService.deletePart(id);
      res.status(200).json({ message: "Запчасть удалена" });
    } catch (error) {
      next(error);
    }
  };
}

export default PartController;
