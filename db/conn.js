const { createPool } = require("mysql2");
require("dotenv").config();

const db = createPool({
  host: "db4free.net",
  user: "inventory",
  password: "nihal123",
  database: "inventory_manage",
});

module.exports = db;