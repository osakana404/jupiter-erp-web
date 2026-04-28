import express from "express";
import PartController from "../controllers/PartController.js";
import PartService from "../services/PartService.js";
import { checkAuth, checkRole } from "../middlewares/auth.js";

const partRouter = express.Router();

const partService = new PartService();
const partController = new PartController(partService);

// GET http://localhost:7000/api/parts/
partRouter.get("/", partController.readAll);

// POST http://localhost:7000/api/parts/
// Только админ может создавать
partRouter.post("/", partController.create);

// PUT http://localhost:7000/api/parts/:id
// Только админ может изменять
partRouter.put("/:id", partController.update);

// DELETE http://localhost:7000/api/parts/:id
// Только админ может удалять
partRouter.delete(
  "/:id",
  checkAuth,
  checkRole(["admin"]),
  partController.delete,
);

export { partRouter };
