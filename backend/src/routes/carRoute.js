import express from "express";
import CarController from "../controllers/CarController.js";
import CarService from "../services/CarService.js";
import { checkAuth, checkRole } from "../middlewares/auth.js";

const carRouter = express.Router();
const carService = new CarService();
const carController = new CarController(carService);

// Просмотр доступен авторизованным пользователям
carRouter.get("/", carController.show);

// Создание, редактирование и удаление — только для админов
carRouter.post("/", checkAuth, checkRole(["admin"]), carController.create);
carRouter.put("/:id", checkAuth, checkRole(["admin"]), carController.update);
carRouter.delete("/:id", checkAuth, checkRole(["admin"]), carController.delete);

export { carRouter };
