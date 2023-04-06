const sessionChecker = (req, res, next) => {
  if (req.session.userAuthenticated) {
	next();
  } else {
      res.redirect("/");
  }
};

module.exports = sessionChecker;