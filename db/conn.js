const { createPool } = require("mysql2");
require("dotenv").config();

const db = createPool({
  host: process.env.DB_host,
  user: process.env.DB_user,
  password: process.env.DB_password,
  database: process.env.DB,
});

module.exports = db;