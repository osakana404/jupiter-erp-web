class DisburseController {
  constructor(disburseService) {
    this.disburseService = disburseService;
  }

  create = async (req, res, next) => {
    try {
      // 1. Собираем пути к файлам
      const photoPaths = req.files ? req.files.map((f) => f.path) : [];

      // 2. Парсим JSON из FormData
      const body =
        typeof req.body.data === "string"
          ? JSON.parse(req.body.data)
          : req.body;

      // 3. Передаем в сервис (не забываем добавить photoPaths третьим аргументом)
      const result = await this.disburseService.createMassDisburse(
        body,
        req.user.id,
        photoPaths,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default DisburseController;
