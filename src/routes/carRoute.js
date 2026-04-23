import express from "express";
import CarController from "../controllers/CarController.js";
import CarService from "../services/CarService.js";
const carRouter = express.Router();

const carService = new CarService();
const carController = new CarController(carService);

carRouter.get("/", carController.show);
carRouter.post("/", carController.create);

export { carRouter };
