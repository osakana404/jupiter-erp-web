import express from "express";
import SupplyController from "../controllers/SupplyController.js";
import SupplyService from "../services/SupplyService.js";
import { checkAuth, checkRole } from "../middlewares/auth.js";
import { uploadPhotos } from "../middlewares/upload.js";

const supplyRouter = express.Router();
const supplyService = new SupplyService();
const supplyController = new SupplyController(supplyService);

// Все операции с накладными должны быть защищены
supplyRouter.use(checkAuth);

supplyRouter.get("/", supplyController.show);
supplyRouter.post("/", uploadPhotos, supplyController.create);

export { supplyRouter };
