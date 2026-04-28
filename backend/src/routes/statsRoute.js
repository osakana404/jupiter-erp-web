import express from "express";
import StatsController from "../controllers/StatsController.js";
import StatsService from "../services/StatsService.js";
import { checkAuth, checkRole } from "../middlewares/auth.js";

const statsRouter = express.Router();
const statsService = new StatsService();
const statsController = new StatsController(statsService);

// Все операции с накладными должны быть защищены
// statsRouter.use(checkAuth);

statsRouter.get("/", statsController.getStats);

export { statsRouter };
