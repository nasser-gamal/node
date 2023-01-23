const Product = require("../models/products");
const User = require("../models/user");

const getCartData = (req, res) => {


  const userId = req.session.user._id;


  User.findById(userId)
    .populate("cart.productId")
    .then((user) => {
      const products = user.cart;
      res.render("shop/cart", {
        pageTitle: "Cart ",
        path: "/shop/cart",
        data: products,
      });
    });
};

const addCart = async (req, res) => {
  try {
    const prodId = req.body.id;
    const userId = req.session.user._id;
    // find User
    const user = await User.findById(userId);
    let cart = user.cart;

    // Check If Product Already Exist In Cart
    const oldProduct = cart.findIndex((product) => {
      return product.productId == prodId;
    });

    if (oldProduct >= 0) {
      // increase Quantity
      cart[oldProduct].quantity += 1;
    } else {
      // add New product
      cart.push({ productId: prodId, quantity: 1 });
    }
    // Update Cart
    await User.findByIdAndUpdate({ _id: userId }, { $set: { cart: cart } });
    return res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

const deleteCart = (req, res) => {
  const productId = req.body.id;

  const cart = req.user.cart.filter((product) => {
    return product._id.toString() !== productId.toString();
  });

  User.findOneAndUpdate({ _id: req.user._id }, { $set: { cart } })
    .then((result) => {
      res.redirect("/shop/cart");
    })
    .catch((err) => console.log(err));
};

module.exports = {
  getCartData,
  addCart,
  deleteCart,
};
