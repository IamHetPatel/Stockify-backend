const userController = require("./userController");
const express = require("express");
const app = express.Router();

app.post("/",userController.createUser)
app.get("/",userController.getUsersList)
app.get("/:id",userController.getUserById)
app.post("/login",userController.createUser)

module.exports = app;