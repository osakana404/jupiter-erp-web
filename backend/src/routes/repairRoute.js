import express from "express";
import RepairController from "../controllers/RepairController.js";
import RepairService from "../services/RepairService.js";
import { checkAuth, checkRole } from "../middlewares/auth.js";

const repairRouter = express.Router();
const repairService = new RepairService();
const repairController = new RepairController(repairService);

//прайс
repairRouter.get("/prices", repairController.readPrices);
repairRouter.post(
  "/prices",
  checkAuth,
  checkRole(["admin"]),
  repairController.createNewPrice,
);

//клиенты
repairRouter.get("/", repairController.readClients);
repairRouter.post(
  "/",
  checkAuth,
  checkRole(["admin"]),
  repairController.createNewClient,
);

export { repairRouter };
