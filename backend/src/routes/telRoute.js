import express from "express";
import TelController from "../controllers/TelController.js";
import TelService from "../services/TelService.js";
import { checkAuth, checkRole } from "../middlewares/auth.js";

const telRouter = express.Router();
const telService = new TelService();
const telController = new TelController(telService);

// Публичный или защищенный просмотр
telRouter.get("/", telController.show);

// Только для админов
telRouter.post("/", checkAuth, checkRole(["admin"]), telController.create);
telRouter.delete("/:id", checkAuth, checkRole(["admin"]), telController.delete);
telRouter.put("/:id", checkAuth, checkRole(["admin"]), telController.update);
export { telRouter };
