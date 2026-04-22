import "dotenv/config";
import express from "express";
import { sequelize, testConnection } from "./config/db.js";
import models from "./src/models/index.cjs";
const { Category, Part } = models;
import { authRouter } from "./src/routes/authRoute.js";

const app = express();
const PORT = process.env.PORT || 7000;

testConnection();
// Это middleware позволяет парсить JSON в теле запроса
app.use(express.json());

app.get("/", (req, res) => {
  // Кука с опциями (время жизни, httpOnly)
  res.cookie("Hi", "There", {
    maxAge: 900000, // 15 минут в миллисекундах
    httpOnly: true, // Защита от доступа через JS
    secure: false, // allow HTTP
  });

  res.status(200).json(req.headers);
});

// Роуты
app.use("/auth", authRouter);

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
