class TransactionController {
  constructor(transactionService) {
    this.transactionService = transactionService;
  }

  getAll = async (req, res, next) => {
    try {
      // Передаем параметры из query string (?startDate=...&endDate=...)
      const result = await this.transactionService.getAllTransactions(
        req.query,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default TransactionController;
