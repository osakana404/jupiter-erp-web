class DisburseController {
  constructor(disburseService) {
    this.disburseService = disburseService;
  }

  create = async (req, res, next) => {
    try {
      const result = await this.disburseService.createMassDisburse(
        req.body,
        req.user.id,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default DisburseController;
