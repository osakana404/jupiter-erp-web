import express from "express";
import CategoryController from "../controllers/CategoryController.js";
import CategoryService from "../services/CategoryService.js";
import { checkAuth, checkRole } from "../middlewares/auth.js";

const categoryRouter = express.Router();
const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

// Публичный или защищенный просмотр
categoryRouter.get("/", categoryController.show);

// Только для админов
categoryRouter.post(
  "/",
  checkAuth,
  checkRole(["admin"]),
  categoryController.create,
);
categoryRouter.put(
  "/:id",
  checkAuth,
  checkRole(["admin"]),
  categoryController.update,
);
categoryRouter.delete(
  "/:id",
  checkAuth,
  checkRole(["admin"]),
  categoryController.delete,
);

export { categoryRouter };
