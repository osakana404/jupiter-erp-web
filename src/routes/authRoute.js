import express from "express";
import { login } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.get("/register", login);

export { authRouter };
