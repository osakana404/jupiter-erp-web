import express from "express";
import DepartmentController from "../controllers/DepartmentController.js";
import DepartmentService from "../services/DepartmentService.js";
import { checkAuth, checkRole } from "../middlewares/auth.js";

const departmentRouter = express.Router();
const departmentService = new DepartmentService();
const departmentController = new DepartmentController(departmentService);

// Публичный или защищенный просмотр
departmentRouter.get("/", departmentController.show);

// Только для админов
departmentRouter.post(
  "/",
  checkAuth,
  checkRole(["admin"]),
  departmentController.create,
);
departmentRouter.put(
  "/:id",
  checkAuth,
  checkRole(["admin"]),
  departmentController.update,
);
departmentRouter.delete(
  "/:id",
  checkAuth,
  checkRole(["admin"]),
  departmentController.delete,
);

export { departmentRouter };
