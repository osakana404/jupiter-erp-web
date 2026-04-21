import "dotenv/config";
import express from "express";
import { sequelize } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 7000;

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.get("/", (req, res) => {
  res.send("asdsad");
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
