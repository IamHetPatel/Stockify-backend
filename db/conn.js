const mysql = require("mysql2");
require('dotenv').config({path: __dirname + '../.env'})
const db = mysql.createConnection({
  host: "db4free.net",
  user: "inventory",
  password: "nihal123",
  database: "inventory_manage",
});

module.exports = db;
