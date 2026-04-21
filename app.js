import "dotenv/config";
import express from "express";
import { sequelize, testConnection } from "./config/db.js";
import models from "./src/models/index.cjs";
const { Category, Part } = models;

const app = express();
const PORT = process.env.PORT || 7000;

testConnection();
console.log(models);

// Это middleware позволяет парсить JSON в теле запроса
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    // Используем явное указание модели и алиаса
    const result = await Part.findAll({
      include: [
        {
          model: Category,
          as: "category", // Этот алиас ДОЛЖЕН совпадать с тем, что в part.cjs
        },
      ],
    });
    res.json(result);
  } catch (error) {
    console.error("ДЕТАЛИ ОШИБКИ:", error);
    res.status(500).json({
      message: "Ошибка при получении данных",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
