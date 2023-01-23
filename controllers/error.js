const getError404 = (req, res) => {
  res.render("error404", { pageTitle: "Error404", path: "/error404" });
};

const getError500 = (req, res) => {
  res.render("error500", { pageTitle: "Error500", path: "/error500" });
};

module.exports = { getError404, getError500 };
