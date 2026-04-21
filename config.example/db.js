import { Sequelize } from "sequelize";
import path from "node:path";

// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve("config", "database.sqlite"),
});

export { sequelize };
