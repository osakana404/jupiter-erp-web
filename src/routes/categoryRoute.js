import express from "express";
import CategoryController from "../controllers/CategoryController.js";
import CategoryService from "../services/CategoryService.js";
import { checkAuth, checkRole } from "../middlewares/auth.js";
const categoryRouter = express.Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

categoryRouter.get("/", checkAuth, categoryController.show);
categoryRouter.post(
  "/",
  checkAuth,
  checkRole(["admin"]),
  categoryController.create,
);

export { categoryRouter };
