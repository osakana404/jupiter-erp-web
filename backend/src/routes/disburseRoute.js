import express from "express";
import DisburseController from "../controllers/DisburseController.js";
import DisburseService from "../services/DisburseService.js";
import { checkAuth, checkRole } from "../middlewares/auth.js";

const disburseRouter = express.Router();
const disburseService = new DisburseService();
const disburseController = new DisburseController(disburseService);

// Все операции с накладными должны быть защищены
disburseRouter.use(checkAuth);

disburseRouter.post("/", disburseController.create);

export { disburseRouter };
