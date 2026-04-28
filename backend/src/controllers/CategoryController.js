class CategoryController {
  constructor(categoryService) {
    this.categoryService = categoryService;
  }

  show = async (req, res, next) => {
    try {
      const result = await this.categoryService.showAll();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const { name } = req.body;
      const result = await this.categoryService.create(name);
      res
        .status(201)
        .json({ message: "Категория успешно создана", result: result });
    } catch (error) {
      next(error);
    }
  };

  // Метод для изменения
  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const result = await this.categoryService.update(id, name);
      res.status(200).json({ message: "Категория обновлена", result: result });
    } catch (error) {
      next(error);
    }
  };

  // Метод для удаления
  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.categoryService.delete(id);
      res.status(200).json({ message: "Категория удалена" });
    } catch (error) {
      next(error);
    }
  };
}

export default CategoryController;
