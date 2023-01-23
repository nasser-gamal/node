const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

// const { getDb } = require("../utils/database");
// const mongodb = require("mongodb");

// class Product {
//   constructor(title, price, imgUrl, description, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.imgUrl = imgUrl;
//     this.description = description;
//     this.id = id;
//     this.userId = userId;
//   }
//   save() {
//     const db = getDb();
//     let _db;
//     if (this.id) {
//       _db = db
//         .collection("products")
//         .updateOne({ _id: new mongodb.ObjectId(this.id) }, { $set: this });
//     } else {
//       _db = db.collection("products").insertOne(this);
//     }
//     return _db
//       .then((result) => console.log(result))
//       .catch((err) => console.log(err));
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         console.log(products);
//         return products;
//       })
//       .catch((err) => console.log(err));
//   }

//   static findById(id) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: new mongodb.ObjectId(id) })
//       .next()
//       .then((product) => {
//         return product;
//       })
//       .catch((err) => console.log(err));
//   }

//   static deleteById(id) {
//     const db = getDb();

//     db.collection('users').find({})
//     return db
//       .collection("products")
//       .deleteOne({ _id: new mongodb.ObjectId(id) })
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => console.log(err));
//   }
// }
// module.exports = Product;
