import express from "express";
import TransactionController from "../controllers/TransactionController.js";
import TransactionService from "../services/TransactionService.js";
import { checkAuth, checkRole } from "../middlewares/auth.js";

const transactionRouter = express.Router();
const transactionService = new TransactionService();
const transactionController = new TransactionController(transactionService);

// Все операции с накладными должны быть защищены
// transactionRouter.use(checkAuth);

transactionRouter.get("/", transactionController.getAll);

export { transactionRouter };
