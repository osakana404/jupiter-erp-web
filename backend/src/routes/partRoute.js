import express from "express";
import PartController from "../controllers/PartController.js";
import PartService from "../services/PartService.js";
import { checkAuth, checkRole } from "../middlewares/auth.js";
const partRouter = express.Router();

const partService = new PartService();
const partController = new PartController(partService);

partRouter.get("/", checkAuth, partController.readAll);
partRouter.post("/", checkAuth, checkRole(["admin"]), partController.create);

export { partRouter };
