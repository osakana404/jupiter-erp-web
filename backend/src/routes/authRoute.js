import express from "express";
import UserController from "../controllers/UserController.js";
import UserService from "../services/UserService.js";
import { checkAuth, checkRole } from "../middlewares/auth.js";

const authRouter = express.Router();

const userService = new UserService();
const userController = new UserController(userService);

authRouter.post("/register", userController.register);
authRouter.post("/login", userController.login);
authRouter.get("/me", checkAuth, userController.me);

export { authRouter };
