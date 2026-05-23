import models from "../models/index.cjs";
const { Agent } = models;

class AgentService {
  async getAgents() {
    try {
      return await Agent.findAll({
        order: [["name", "ASC"]],
      });
    } catch (error) {
      throw error;
    }
  }

  async createAgent(data) {
    const { name, inn } = data;
    if (!name) {
      throw new Error("Наименование контрагента обязательно!");
    }
    try {
      return await Agent.create({
        name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        inn: data.inn,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateAgent(id, data) {
    try {
      const agent = await Agent.findByPk(id);
      if (!agent) throw new Error("Контрагент не найден");

      return await agent.update({
        name: data.name || agent.name,
        phone: data.phone || agent.phone,
        email: data.email || agent.email,
        address: data.address || agent.address,
        inn: data.inn || agent.inn,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteAgent(id) {
    try {
      const agent = await Agent.findByPk(id);
      if (!agent) throw new Error("Контрагент не найден");

      // Проверка на наличие связанных поступлений (Supplies)
      // Sequelize выдаст ошибку, если есть зависимости, и это правильно.
      await agent.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default AgentService;
