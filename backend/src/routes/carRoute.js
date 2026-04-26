import express from "express";
import CarController from "../controllers/CarController.js";
import CarService from "../services/CarService.js";
import { checkAuth, checkRole } from "../middlewares/auth.js";
const carRouter = express.Router();

const carService = new CarService();
const carController = new CarController(carService);

carRouter.get("/", checkAuth, carController.show);
carRouter.post("/", checkAuth, checkRole(["admin"]), carController.create);

export { carRouter };
