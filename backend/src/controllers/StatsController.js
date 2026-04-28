class StatsController {
  constructor(statsService) {
    this.statsService = statsService;
  }

  getStats = async (req, res, next) => {
    try {
      const stats = await this.statsService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  };
}

export default StatsController;
