module.exports = {
  development: {
    dialect: "sqlite",
    storage: "./config/database.sqlite",
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
  },
  production: {
    dialect: "sqlite",
    storage: "./config/database.sqlite",
  },
};
