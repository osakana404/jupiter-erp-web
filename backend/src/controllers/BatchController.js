class BatchController {
  constructor(batchService) {
    this.batchService = batchService;
  }

  index = async (req, res, next) => {
    try {
      const batches = await this.batchService.getAllBatches();
      res.status(200).json(batches);
    } catch (error) {
      next(error);
    }
  };
}

export default BatchController;
