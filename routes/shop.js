const express = require("express");

const router = express.Router();

const shopConrollers = require("../controllers/shop");

router.get("/", shopConrollers.getProducts);

router.get("/product/:id", shopConrollers.getProduct);

module.exports = router;
