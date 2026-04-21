import "dotenv/config";
import express from "express";
import { sequelize, testConnection } from "./config/db.js";
import db from "./src/models/index.cjs";

const app = express();
const PORT = process.env.PORT || 7000;
const { Category } = db;

testConnection();

app.get("/", (req, res) => {
  res.send("asdsad");
});

console.log("Содержимое db:", Object.keys(db));

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
