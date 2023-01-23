const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgridTransproter = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

var options = {
  auth: {
    api_key:
      "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",
  },
};

const transporter = nodemailer.createTransport(sendgridTransproter(options));

const register = (req, res) => {
  const isAuthenticate = req.session.isAuthenticate;
  if (isAuthenticate) {
    return res.redirect("/");
  }
  let message = req.flash("errorMessage");

  if (message) {
    message = message[0];
  } else {
    message = null;
  }

  // res.setHeader("Set-Cookie", "logged=true");
  res.render("shop/register", {
    pageTitle: "Register",
    path: "shop/register",
    errorMessage: message,
    oldData: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobileNumber: "",
    },
    validationErrors: [],
  });
};

const login = (req, res) => {
  const isAuthenticate = req.session.isAuthenticate;

  if (isAuthenticate) {
    return res.redirect("/");
  }

  let message = req.flash("errorMessage");

  if (message) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("shop/login", {
    pageTitle: "Login",
    path: "shop/login",
    errorMessage: message,
    oldData: {
      email: "",
      password: "",
    },
  });
};

const addUser = async (req, res) => {
  try {
    const { userName, email, password, mobileNumber } = req.body;

    const message = validationResult(req);
    if (!message.isEmpty()) {
      return res.status(422).render("shop/register", {
        pageTitle: "Register",
        path: "shop/register",
        errorMessage: message.array()[0].msg,
        oldData: {
          userName,
          email,
          password,
          confirmPassword: req.body.confirmPassword,
          mobileNumber,
        },
        validationErrors: message.array(),
      });
    }

    const _user = await User.findOne({ email });
    if (_user) {
      req.flash("errorMessage", "User Already Exist");
      return res.redirect("/register");
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      userName,
      email,
      password: hashPassword,
      mobileNumber,
    });
    user.save(() => {
      res.redirect("/login");
    });
  } catch (err) {
    console.log(err);
  }
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  const message = validationResult(req);

  if (!message.isEmpty()) {
    return res.status(422).render("shop/login", {
      pageTitle: "Login",
      path: "shop/login",
      errorMessage: message.array()[0].msg,
    });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("errorMessage", "Email or Password Is Wrong");
        return res.status(422).render("shop/login", {
          pageTitle: "Login",
          path: "shop/login",
          errorMessage: req.flash("errorMessage"),
          oldData: {
            email,
            password,
          },
        });
      }
      const _password = bcrypt.compareSync(password, user.password);
      if (!_password) {
        req.flash("errorMessage", "Email or Password Is Wrong");
        return res.status(422).render("shop/login", {
          pageTitle: "Login",
          path: "shop/login",
          errorMessage: req.flash("errorMessage")[0],
          oldData: {
            email,
            password,
          },
        });
      }
      req.session.isAuthenticate = true;
      req.session.user = user;
      return res.redirect("/");
    })
    .catch((err) => console.log(err));
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

const forgetPasswordPage = (req, res) => {
  let message = req.flash("errorMessage");
  const isAuthenticate = req.session.isAuthenticate;
  if (isAuthenticate) {
    return res.redirect("/");
  }
  if (message) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("shop/forgetPassword", {
    pageTitle: "ForgetPassword",
    path: "shop/forgetPassword",
    errorMessage: message,
    oldData: {
      email: "",
    },
    validationErrors: [],
  });
};

const forgetPassword = (req, res) => {
  const email = req.body.email;
  let message = validationResult(req);

  if (!message.isEmpty()) {
    return res.status(422).render("shop/forgetPassword", {
      pageTitle: "ForgetPassword",
      path: "shop/forgetPassword",
      errorMessage: message.array()[0].msg,
      oldData: {
        email,
      },
      validationErrors: message.array(),
    });
  }

  // Create Random Token
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect("/forget-password");
    }
    const token = buffer.toString("hex");
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("errorMessage", "Email Not Exist");
          return res.status(422).render("shop/forgetPassword", {
            pageTitle: "ForgetPassword",
            path: "shop/forgetPassword",
            errorMessage: req.flash("errorMessage"),
            oldData: {
              email,
            },
            validationErrors: message.array(),
          });
        }
        user.resetToken = token;
        user.tokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        transporter.sendMail(
          {
            to: email,
            from: "nassergamal2222@gmail.com",
            subject: "you asked to Reset Your Password",
            html: `<p>Click In The <a href='http://localhost:8000/reset-password/${token}'>Link</a> To Reset Your Password</p>'`,
          },
          (err) => {
            if (err) console.log(err);
          }
        );
        return res.redirect("/forget-password");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const resetPasswordPage = (req, res) => {
  const isAuthenticate = req.session.isAuthenticate;
  if (isAuthenticate) {
    return res.redirect("/");
  }
  let message = req.flash("errorMessage");
  if (message) {
    message = message[0];
  } else {
    message = null;
  }
  const userToken = req.params.token;
  User.findOne({
    resetToken: userToken,
    tokenExpiration: { $gt: Date.now() },
  }).then((user) => {
    if (!user) {
      return res.redirect("/forget-password");
    }
    res.render("shop/resetPassword", {
      pageTitle: "ResetPassword",
      path: "shop/resetPassword",
      errorMessage: message,
      userId: user._id,
      token: userToken,
    });
  });
};

const resetPassword = (req, res) => {
  const { userId, token, password } = req.body;

  User.findOne({
    _id: userId,
    resetToken: token,
    tokenExpiration: { $gt: Date.now() },
  }).then((user) => {
    if (!user) {
      return res.redirect("/forget-password");
    }
    bcrypt
      .hash(password, 12)
      .then((hashPassword) => {
        user.resetToken = undefined;
        user.tokenExpiration = undefined;
        user.password = hashPassword;
        return user.save();
      })
      .then((result) => {
        return res.redirect("/login");
      });
  });
};

module.exports = {
  register,
  login,
  addUser,
  loginUser,
  logout,
  forgetPasswordPage,
  resetPasswordPage,
  forgetPassword,
  resetPassword,
};
