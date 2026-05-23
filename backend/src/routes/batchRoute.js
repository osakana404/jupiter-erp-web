import express from "express";

import { checkAuth, checkRole } from "../middlewares/auth.js";
import BatchService from "../services/BatchService.js";
import BatchController from "../controllers/BatchController.js";

const batchRouter = express.Router();

const batchService = new BatchService();
const batchController = new BatchController(batchService);

batchRouter.get("/", batchController.index);

export { batchRouter };
