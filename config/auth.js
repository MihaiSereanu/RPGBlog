module.exports = {
  checkAuthenticated: function (request, response, next) {
    if (request.isAuthenticated()) {
      return next();
    }
    response.redirect("/users/login");
  },
  checkNotAuthenticated: function (request, response, next) {
    if (request.isAuthenticated()) {
      return response.redirect("/");
    }
    next();
  },
};
