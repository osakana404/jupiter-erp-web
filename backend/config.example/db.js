import { Sequelize } from "sequelize";
import path from "node:path";

// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve("config", "database.sqlite"),
  logging: false, // Чтобы не спамить в консоль SQL-запросами (можно включить для дебага)
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export { sequelize, testConnection };
