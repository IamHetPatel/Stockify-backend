const mysql = require("mysql");
require("dotenv").config();
const db = mysql.createConnection({
  host: "db4free.net",
  user: "inventory",
  password: "nihal123",
  database: "inventory_manage",
});

module.exports = db;
