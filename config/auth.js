module.exports = {
  checkAuthenticated: function (request, response, next) {
    if (request.isAuthenticated()) {
      return next();
    }
    response.redirect("/users/login");
  },
  checkNotAuthenticated: function (request, response, next) {
    let errors = [];
    if (request.isAuthenticated()) {
      errors.push({ msg: "You are already logged in!" });
      return response.redirect("/");
    }
    next();
  },
};
