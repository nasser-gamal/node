const Product = require("../models/products");

const getProducts = (req, res) => {
  // const logged = req.get("Cookie").trim().split("=")[1];

  const page = +req.query.page || 1;
  let totalItems;
  const itemPerPage = 2;

  Product.countDocuments()
    .then((count) => {
      totalItems = count;
      return Product.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * itemPerPage)
        .limit(itemPerPage)
        .populate("userId", "userName -_id");
    })
    .then((products) => {
      res.render("shop/index", {
        pageTitle: "Shop ",
        path: "/",
        data: products,
        nextPage: page + 1,
        previousPage: page - 1,
        currentPage: page,
        hasNextPage: itemPerPage * page < totalItems,
        hasPreviousPage: page > 1,
        lastPage: Math.ceil(totalItems / itemPerPage),
        hasPagenation: totalItems > itemPerPage ? true : false,
      });
    })
    .catch();
};

const getProduct = (req, res) => {
  const isAuthenticate = req.session.isAuthenticate;

  Product.findById(req.params.id).then((product) => {
    res.render("shop/product", {
      pageTitle: "Shop ",
      path: "/",
      data: product,
      isAuthenticate,
    });
  });
};

module.exports = {
  getProduct,
  getProducts,
};
