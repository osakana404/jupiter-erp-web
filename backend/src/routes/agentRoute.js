import express from "express";
import AgentController from "../controllers/AgentController.js";
import AgentService from "../services/AgentService.js";
import { checkAuth, checkRole } from "../middlewares/auth.js";

const agentRouter = express.Router();
const agentService = new AgentService();
const agentController = new AgentController(agentService);

agentRouter.get("/", checkAuth, agentController.show);
agentRouter.post("/", checkAuth, checkRole(["admin"]), agentController.create);
agentRouter.put(
  "/:id",
  checkAuth,
  checkRole(["admin"]),
  agentController.update,
);
agentRouter.delete(
  "/:id",
  checkAuth,
  checkRole(["admin"]),
  agentController.delete,
);

export { agentRouter };
