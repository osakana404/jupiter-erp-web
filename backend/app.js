import "dotenv/config";
import cors from "cors";
import express from "express";
import { sequelize, testConnection } from "./config/db.js";
import models from "./src/models/index.cjs";
const { Category, Part } = models;
import { authRouter } from "./src/routes/authRoute.js";
import cookieParser from "cookie-parser"; // Импортируем
import { checkAuth } from "./src/middlewares/auth.js";
import { carRouter } from "./src/routes/carRoute.js";
import { partRouter } from "./src/routes/partRoute.js";
import { categoryRouter } from "./src/routes/categoryRoute.js";
import { agentRouter } from "./src/routes/agentRoute.js";
import { supplyRouter } from "./src/routes/supplyRoute.js";
import { batchRouter } from "./src/routes/batchRoute.js";
import { disburseRouter } from "./src/routes/disburseRoute.js";
import { transactionRouter } from "./src/routes/transactionRoute.js";
import { statsRouter } from "./src/routes/statsRoute.js";

const app = express();

const PORT = process.env.PORT || 7000;
app.use(
  cors({
    origin: "http://localhost:5173", // Разрешаем доступ только твоему фронтенду
    credentials: true, // Важно для работы с КУКАМИ!
  }),
);

testConnection();
app.use(cookieParser()); // Теперь req.cookies будет работать!
// Это middleware позволяет парсить JSON в теле запроса
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Jupiter" });
});

// Роуты
app.use("/auth", authRouter);
app.use("/api/cars", carRouter);
app.use("/api/parts", partRouter);
app.use("/api/category", categoryRouter);
app.use("/api/agents", agentRouter);
app.use("/api/supplies", supplyRouter);
app.use("/api/batches", batchRouter);
app.use("/api/disburse", disburseRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/stats", statsRouter);
// Обработчик ошибок
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: {}, // Здесь можно скрыть подробности ошибки для безопасности
  });
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
