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
      // Берем userId из req.user (который добавил middleware авторизации)
      const result = await this.supplyService.createSupply(
        req.body,
        req.user.id,
      );
      res.status(201).json({ message: "Приход оформлен", result });
    } catch (error) {
      next(error);
    }
  };
}

export default SupplyController;
