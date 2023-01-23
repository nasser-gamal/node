const express = require("express");

const router = express.Router();

const userControllers = require("../controllers/user");

const { body } = require("express-validator");

router.get("/register", userControllers.register);

router.get(
  "/login",
  body("email").isEmail().withMessage("Email Not Valid"),
  body("password")
    .isLength({ min: 5, max: 10 })
    .withMessage("password must be at least 5 Characters to 10 Characters"),
  userControllers.login
);

router.post(
  "/register",
  body("userName").notEmpty().withMessage("UserName Is a required Field"),
  body("email", "email wrong")
    .isEmail()
    .withMessage("Email Not Valid")
    .normalizeEmail(),

  // .custom((value, { req }) => {
  //   if (value !== "nassergamal2222@gmail.com") {
  //     throw new Error("Email Not Match");
  //   }
  //   return true;
  // }),
  body("password")
    .isLength({ min: 5, max: 10 })
    .withMessage("password must be at least 5 Characters to 10 Characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error(`Password dosn't Match`);
    }
    return true;
  }),
  body("mobileNumber")
    .isLength({ min: 11, max: 11 })
    .withMessage("Mobile Is Not Valid"),
  userControllers.addUser
);

router.post("/login", userControllers.loginUser);

router.post("/logout", userControllers.logout);

router.get("/forget-password", userControllers.forgetPasswordPage);
router.post(
  "/forget-password",
  body("email")
    .notEmpty()
    .withMessage("Email Is Required Field")
    .isEmail()
    .withMessage("Email Not Valid"),

  userControllers.forgetPassword
);

router.get("/reset-password/:token", userControllers.resetPasswordPage);
router.post("/reset-password", userControllers.resetPassword);

module.exports = router;
