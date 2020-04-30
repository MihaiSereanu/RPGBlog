module.exports = {
  checkAuthenticated: function (request, response, next) {
    if (request.isAuthenticated()) {
      return next();
    }
    response.redirect("/users/login");
    request.flash("error_msg", "You need to log in to view that page.");
  },
  checkNotAuthenticated: function (request, response, next) {
    if (request.isAuthenticated()) {
      request.flash("error_msg", "You are already logged in.");
      return response.redirect("/");
    }
    next();
  },
  requireAdmin: function (request, response, next) {
    if (request.user && request.user.isAdmin === true) {
      next();
    } else {
      request.flash("error_msg", "You do not have access to that page.");
      response.redirect("./");
    }
  },
};
