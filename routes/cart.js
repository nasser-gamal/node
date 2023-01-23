const express = require("express");
const router = express.Router();

const cartControllers = require("../controllers/cart");
const authenticate = require("../middlewares/auth");

router.get("/shop/cart", authenticate, cartControllers.getCartData);

router.post("/cart/add", authenticate, cartControllers.addCart);

router.post("/shop/cart-delete", authenticate, cartControllers.deleteCart);

module.exports = router;
