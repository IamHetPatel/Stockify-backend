const express = require("express");
const router = express.Router();
const supplierController = require("./supplierController");

const jwt_validation = require("./../auth/jwt_validation");

router.get("/", jwt_validation.checkJwt, supplierController.getSuppliersList);
router.post("/", jwt_validation.checkJwt, supplierController.createSupplier);
router.get("/:name", jwt_validation.checkJwt, supplierController.getSupplierBySupplierName);

module.exports = router;