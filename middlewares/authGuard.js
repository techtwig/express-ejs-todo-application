function sessionChecker(req, res, next) {
  if (!req.session.userAuthenticated) {
    return res.redirect('/login');
  }
  next();
}

module.exports = sessionChecker;