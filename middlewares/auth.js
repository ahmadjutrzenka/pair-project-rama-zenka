function isLoggedIn(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect("/login");
  }
}

function isSeller(req, res, next) {
  if (req.session && req.session.role === "seller") {
    next();
  } else {
    res.redirect("/products");
  }
}

module.exports = { isLoggedIn, isSeller };
