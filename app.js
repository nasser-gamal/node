const express = require("express");
// const { mongoConnect } = require("./utils/database");
const app = express();
require("dotenv").config();
const https = require("https");

const mongoose = require("mongoose");
const session = require("express-session");
const MongoSession = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const shopRouters = require("./routes/shop");
const adminRouters = require("./routes/admin");
const cartRouters = require("./routes/cart");
const userRouters = require("./routes/user");
const orderRouters = require("./routes/order");
const User = require("./models/user");

const { getError404, getError500 } = require("./controllers/error");

const PORT = process.env.PORT || 8000;

// const pricateKey = fs.readFileSync("server.key");
// const certificate = fs.readFileSync("server.cert");

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.vhixoru.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

const store = new MongoSession({
  uri,
  collection: "sessions",
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const scrfProtection = csrf();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage, fileFilter }).single("image"));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(helmet());
// app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(scrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.isAuthenticate = req.session.isAuthenticate;
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(shopRouters);
app.use(adminRouters);
app.use(userRouters);
app.use(cartRouters);
app.use(orderRouters);

app.get("/500", getError500);

app.use(getError404);

// app.use((error, req, res, next) => {
//   res.redirect("/500")
// })

// mongoConnect(() => {
//   app.listen(PORT);
// });

mongoose
  .connect(uri)
  .then((result) => {
    app.listen(PORT);

    // const server = app.listen(process.env.PORT || PORT);
    // https
    //   .createServer(
    //     {
    //       key: pricateKey,
    //       cert: certificate,
    //     },
    //     app
    //   )
    // .listen(process.env.PORT || PORT);
    // const io = require("./socket").init(server);
    // io.on("connection", (socket) => {
    //   console.log("a user connected");
    // });
  })
  .catch((err) => console.log(err));
