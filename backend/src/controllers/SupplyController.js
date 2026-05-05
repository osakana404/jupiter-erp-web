class SupplyController {
  constructor(supplyService) {
    this.supplyService = supplyService;
  }

  show = async (req, res, next) => {
    try {
      const result = await this.supplyService.getSupplies();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      // Данные из FormData приходят в req.body, а файлы в req.files
      const photoPaths = req.files ? req.files.map((f) => f.path) : [];

      // Если fetch прислал items как строку (особенность FormData), парсим её
      const body =
        typeof req.body.data === "string"
          ? JSON.parse(req.body.data)
          : req.body;
      // Берем userId из req.user (который добавил middleware авторизации)
      const result = await this.supplyService.createSupply(
        body,
        req.user.id,
        photoPaths,
      );
      res.status(201).json({ message: "Приход оформлен", result });
    } catch (error) {
      // Если файлов слишком много, Multer выкинет 'LIMIT_UNEXPECTED_FILE'
      if (error.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "Файл слишком большой (макс. 5МБ)" });
      }
      if (error.code === "LIMIT_FILE_COUNT") {
        return res
          .status(400)
          .json({ message: "Можно загрузить не более 10 фото" });
      }
      next(error);
    }
  };
}

export default SupplyController;
