const Order = require("../models/orders");
const User = require("../models/user");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const { fontSize } = require("pdfkit");
// const stripe = require("stripe")(process.env.STRIPE_KEY);

const getOrders = (req, res) => {
  const isAuthenticate = req.session.isAuthenticate;
  const userId = req.session.user._id;
  Order.find({ userId })
    .populate("userId", "userName -_id")
    .populate("orders.productId", "title price imgUrl description -_id")
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "orders",
        path: "/shop/orders",
        orders,
        isAuthenticate,
      });
    });
};

const addOrders = (req, res) => {
  const id = req.session.user._id;

  User.findById(id)
    .then((user) => {
      const cart = user.cart;
      let orders = [];
      cart.map((item) => {
        orders.push({ productId: item.productId, quantity: item.quantity });
      });
      return orders;
    })
    .then((orders) => {
      Order.create({
        orders,
        userId: req.user._id,
      });
      return User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { cart: [] } }
      );
    })
    .then((result) => {
      return res.redirect("/shop/cart");
    })

    .catch((err) => console.log(err));
};

const getInvoice = (req, res) => {
  const orderId = req.params.orderId;
  const orderName = `invoice-${orderId}.pdf`;
  const orderPath = path.join("data", "invoices", orderName);

  Order.findOne({ _id: orderId, userId: req.user._id })
    .populate("orders.productId")
    .then((order) => {
      if (!order) {
        return res.redirect("/500");
      }
      // fs.readFile(orderPath, (err, fileContent) => {
      //   if (err) {
      //     return console.log(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Dispostion",
      //     'inline; filename="' + orderName + '"'
      //   );
      //   res.send(fileContent);
      // });
      // const file = fs.createReadStream(orderPath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader(
      //   "Content-Dispostion",
      //   'inline; filename="' + orderName + '"'
      // );
      // file.pipe(res);

      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(fs.createWriteStream(orderPath));
      pdfDoc.pipe(res);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Dispostion",
        'inline; filename="' + orderName + '"'
      );
      pdfDoc.fontSize(25).text("Invoice");

      pdfDoc.text("-----------------------");

      pdfDoc.text(`OrderID : ${order._id}`);
      let totalPrice = 0;
      order.orders.map((products) => {
        pdfDoc.text(`Product Name : ${products.productId.title}`);
        pdfDoc.text("");

        pdfDoc.text(`Price : ${products.productId.price}`);
        pdfDoc.text("");

        pdfDoc.text(`Quantity : ${products.quantity}`);
        totalPrice +=
          Number(products.productId.price) * Number(products.quantity);
      });
      pdfDoc.text("");
      pdfDoc.text(`Total Price: ${totalPrice}`);

      pdfDoc.end();
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/500");
    });
};

// const getCheckout = (req, res) => {
//   const userId = req.session.user._id;

//   let totalPrice = 0;
//   User.findById(userId)
//     .populate("cart.productId")
//     .then((user) => {
//       const products = user.cart;
//       products
//         .map((product) => {
//           return (totalPrice += product.productId.price * product.quantity);
//         })

//         // return stripe.checkout.sessions
//         //   .create({
//         //     payment_method_types: ["card"],
//         //     line_items: products.map((product) => {
//         //       return {
//         //         price_data: {
//         //           currency: "usd",
//         //           unit_amount: product.productId.price * 100,
//         //           product_data: {
//         //             name: product.productId.title,
//         //             description: product.productId.description,
//         //           },
//         //         },
//         //         quantity: product.quantity,
//         //       };
//         //     }),
//         //     mode: "payment",
//         //     success_url: `${req.protocol}://${req.get("host")}/checkout/success`,
//         //     cancel_url: `${req.protocol}://${req.get("host")}/checkout/cancel`,
//         //   })
//         .then((session) => {
//           res.render("shop/checkout", {
//             pageTitle: "Cart ",
//             path: "/checkout",
//             data: products,
//             totalPrice,
//             sessionId: session.id,
//           });
//         });
//     });
// };

module.exports = {
  getOrders,
  addOrders,
  getInvoice,
  // getCheckout,
};
