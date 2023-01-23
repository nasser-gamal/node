const express = require("express");
const router = express.Router();

const adminControllers = require("../controllers/admin");

const authenticate = require("../middlewares/auth");

const { body } = require("express-validator");
const upload = require("../middlewares/multer");

router.get(
  "/admin/addProducts",
  authenticate,
  adminControllers.addProductsForm
);

router.post(
  "/add-products",
  body("title").notEmpty().withMessage("title Is a required Field"),
  body("price")
    .notEmpty()
    .withMessage("Price Is a Required Field")
    .isFloat()
    .withMessage("Price Invalid Accept only Numbers"),
  body("description").notEmpty().withMessage("description Is a Required Field"),
  authenticate,
  adminControllers.addProducts
);

router.get("/admin/products", authenticate, adminControllers.getProducts);

router.get(
  "/admin/edit-product/:id",
  authenticate,
  adminControllers.editProductsForm
);

router.post(
  "/admin/edit-product/:id",
  body("title").notEmpty().withMessage("title Is a required Field"),
  body("price")
    .notEmpty()
    .withMessage("Price Is a Required Field")
    .isFloat()
    .withMessage("Price Invalid Accept only Numbers"),
  body("description").notEmpty().withMessage("description Is a Required Field"),
  authenticate,
  adminControllers.editProducts
);

router.delete(
  "/admin/delete-product/:productId",
  authenticate,
  adminControllers.deleteProducts
);

module.exports = router;
