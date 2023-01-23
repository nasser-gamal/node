const authenticate = (req, res, next) => {
  const isAuthenticate = req.session.isAuthenticate;

  if (!isAuthenticate) {
    return res.redirect("/");
  }
  next();
};

module.exports = authenticate;
