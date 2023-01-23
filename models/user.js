const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    resetToken: { type: String },
    tokenExpiration: { type: Date },
    cart: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          quantity: { type: Number, requird: true },
        },
      ],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

// const { getDb } = require("../utils/database");
// const mongodb = require("mongodb");
// const Product = require("./products");

// class User {
//   constructor(
//     userName,
//     email,
//     password,
//     mobileNumber,
//     isAdmin = false,
//     cart = [],
//     id
//   ) {
//     this.userName = userName;
//     this.email = email;
//     this.password = password;
//     this.mobileNumber = mobileNumber;
//     this.isAdmin = isAdmin;
//     this.cart = cart;
//     this.id = id;
//   }
//   save() {
//     const db = getDb();
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => console.log(err));
//   }

//   addToCart(productId) {
//     const db = getDb();
//     console.log(productId);

//     //  Check If The Product Is Already Exist
//     let cart = [...this.cart];
//     let updateProduct;
//     const oldProduct = this.cart.findIndex((product) => {
//       return productId.toString() === product.productId.toString();
//     });

//     if (oldProduct >= 0) {
//       cart[oldProduct].quantity += 1;
//     } else {
//       updateProduct = {
//         productId,
//         quantity: 1,
//       };
//       cart.push(updateProduct);
//     }

//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this.id) },
//         {
//           $set: {
//             cart: cart,
//           },
//         }
//       )
//       .then((result) => console.log(result))
//       .catch((err) => console.log(err));
//   }

//   getCart() {
//     const db = getDb();

//     const productsId = this.cart.map((product) => {
//       return product.productId;
//     });

//     return db
//       .collection("products")
//       .find({ _id: { $in: productsId } })
//       .toArray()
//       .then((products) => {
//         return products.map((product) => {
//           return {
//             ...product,
//             quantity: this.cart.find((prod) => {
//               return product._id.toString() === prod.productId.toString();
//             }).quantity,
//           };
//         });
//       });
//   }

//   deleteCart(id) {
//     const db = getDb();

//     let cart = this.cart.filter((items) => {
//       return items.productId.toString() !== id.toString();
//     });

//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this.id) },
//         {
//           $set: {
//             cart: cart,
//           },
//         }
//       )
//       .then((result) => console.log(result))
//       .catch((err) => console.log(err));
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           products: products,
//           user: {
//             _id: new mongodb.ObjectId(this.id),
//             userName: this.userName,
//             email: this.email,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new mongodb.ObjectId(this.id) },
//             { $set: { cart: [] } }
//           );
//       })
//       .catch((err) => console.log(err));

//     // return console.log("cart", this.cart);
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new mongodb.ObjectId(this.id) })
//       .toArray()
//       .then((products) => {
//         return products;
//       });
//   }

//   static findById(id) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .find({ _id: new mongodb.ObjectId(id) })
//       .next()
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = User;
