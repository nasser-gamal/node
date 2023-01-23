const Product = require("../models/products");
// const mongodb = require("mongodb");
const fs = require("fs");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const deleteFile = require("../utils/fileHelper");
const io = require("../socket");
const addProductsForm = (req, res) => {
  res.render("admin/addProducts", {
    pageTitle: "addProducts ",
    path: "/admin/addProducts",
    edit: false,
    errorMessage: "",
    hasError: false,
    product: {
      title: "",
      price: "",
      description: "",
    },
    validationErrors: [],
  });
};

const editProductsForm = (req, res) => {
  const id = req.params.id;
  const edit = req.query.edit;

  if (!edit) {
    res.redirect("/admin/addProducts");
  }

  Product.findById(id)
    .then((product) => {
      // throw new Error('boom')
      res.render("admin/addProducts", {
        pageTitle: "addProducts ",
        path: "/edit/addProducts",
        edit: edit,
        hasError: false,
        product: product,
        errorMessage: "",
        validationErrors: [],
      });
    })
    .catch((err) => console.log(err));
};

const getProducts = (req, res) => {
  const page = +req.query.page || 1;
  const itemPerPage = 2;
  let totalItems;

  Product.find({ userId: req.user._id })
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Product.find({ userId: req.user._id })
        .skip((page - 1) * itemPerPage)
        .limit(itemPerPage)
        .populate("userId", " userName");
    })
    .then((products) => {
      res.render("admin/products", {
        pageTitle: "products",
        path: "/admin/products",
        data: products,
        totalItems,
        nextPage: page + 1,
        previousPage: page - 1,
        currentPage: page,
        hasNextPage: itemPerPage * page < totalItems,
        hasPreviousPage: page > 1,
        lastPage: Math.ceil(totalItems / itemPerPage),
        hasPagenation: totalItems > itemPerPage ? true : false,
      });
    })
    .catch((err) => {
      return res.redirect("/500");
    });
};

const addProducts = (req, res) => {
  const { title, price, description } = req.body;
  const userId = req.session.user._id;
  const image = req.file;
  if (!image) {
    return res.render("admin/addProducts", {
      pageTitle: "addProducts ",
      path: "/admin/addProducts",
      edit: false,
      hasError: true,
      errorMessage: "file Not Valid Accecpt png or jpj",
      product: {
        title,
        price,
        description,
      },
      validationErrors: [],
    });
  }

  const message = validationResult(req);
  if (!message.isEmpty()) {
    return res.render("admin/addProducts", {
      pageTitle: "addProducts ",
      path: "/admin/addProducts",
      edit: false,
      hasError: true,
      errorMessage: message.array()[0].msg,
      product: {
        title,
        price,
        description,
      },
      validationErrors: message.array(),
    });
  }

  const product = new Product({
    title,
    price,
    image: image.path,
    description,
    userId,
  });
  product
    .save()
    .then((result) => {
      io.getIO().emit("product", {
        product,
        userName: req.user.userName,
      });
    })
    .then((result) => res.redirect("/"))
    .catch((err) => res.redirect("/500"));
};

const editProducts = (req, res) => {
  const { id, title, price, description } = req.body;
  const image = req.file;
  const userId = req.user._id;
  const message = validationResult(req);

  if (!message.isEmpty()) {
    return res.render("admin/addProducts", {
      pageTitle: "addProducts ",
      path: "/edit/addProducts",
      edit: true,
      hasError: true,
      errorMessage: message.array()[0].msg,
      product: {
        title,
        price,
        description,
        _id: id,
      },
      validationErrors: message.array(),
    });
  }

  Product.findOne({ _id: id, userId })
    .then((product) => {
      product.title = title;
      product.price = price;
      product.description = description;
      if (image) {
        product.image = image.path;
      }
      return product.save();
    })
    .then((result) => {
      return res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

const deleteProducts = (req, res) => {
  const id = req.params.productId;
  const userId = req.session.user._id;

  Product.findOne({ _id: id, userId })
    .then((product) => {
      const path = product.image;
      return deleteFile(path);
    })
    .then((result) => {
      Product.findOneAndDelete({ _id: id, userId })
        // .then((result) => {
        //   return io.getIO().emit("delete", id);
        // })
        .then((result) => {
          return res.redirect("/admin/products");
        });
    })

    .catch((err) => console.log(err));
};

module.exports = {
  addProductsForm,
  addProducts,
  getProducts,
  editProductsForm,
  editProducts,
  deleteProducts,
};
