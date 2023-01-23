const express = require("express");
const router = express.Router();

const orderControllers = require("../controllers/order");
const authenticate = require("../middlewares/auth");

router.get("/shop/orders", authenticate, orderControllers.getOrders);

router.post("/shop/add-order", authenticate, orderControllers.addOrders);

router.get("/invoice/:orderId", authenticate, orderControllers.getInvoice);

// router.get("/checkout", authenticate, orderControllers.getCheckout);

// router.post("/checkout/success", authenticate, orderControllers.addOrders);

// router.get("/checkout/success", authenticate, (req, res) => {
//     res.redirect("/shop/orders")
// });

// router.get("/checkout/cancel", authenticate, orderControllers.getCheckout);

module.exports = router;
