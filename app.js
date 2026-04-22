import "dotenv/config";
import express from "express";
import { sequelize, testConnection } from "./config/db.js";
import models from "./src/models/index.cjs";
const { Category, Part } = models;
import { authRouter } from "./src/routes/authRoute.js";
import cookieParser from "cookie-parser"; // Импортируем

const app = express();

const PORT = process.env.PORT || 7000;

testConnection();
app.use(cookieParser()); // Теперь req.cookies будет работать!
// Это middleware позволяет парсить JSON в теле запроса
app.use(express.json());

app.get("/", (req, res) => {
  console.log(req.cookies); // Проверяем, что пришло от клиента
  // Кука с опциями (время жизни, httpOnly)
  res.cookie("theme", "light", {
    maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
    httpOnly: false, // чтобы был доступен для JS
    secure: false, // allow HTTP
  });

  res.status(200).json({ message: "Welcome", receivedCookies: req.cookies });
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
