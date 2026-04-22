import express from "express";
import UserController from "../controllers/UserController.js";
import UserService from "../services/UserService.js";

const authRouter = express.Router();

const userService = new UserService();
const userController = new UserController(userService);

authRouter.post("/register", userController.register);
authRouter.post("/login", userController.login);

export { authRouter };
