class AgentController {
  constructor(agentService) {
    this.agentService = agentService;
  }

  show = async (req, res, next) => {
    try {
      const result = await this.agentService.getAgents();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const result = await this.agentService.createAgent(req.body);
      res.status(201).json({ message: "Контрагент успешно добавлен", result });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.agentService.updateAgent(id, req.body);
      res.status(200).json({ message: "Данные контрагента обновлены", result });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.agentService.deleteAgent(id);
      res.status(200).json({ message: "Контрагент удален" });
    } catch (error) {
      next(error);
    }
  };
}

export default AgentController;
