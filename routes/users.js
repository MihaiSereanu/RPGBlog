if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");
const { checkAuthenticated, checkNotAuthenticated } = require("../config/auth");

function requireAdmin() {
  return function (request, response, next) {
    User.findOne({ email: email }, function (error, user) {
      if (error) {
        return next(error);
      }

      if (user.isAdmin) {
        // Do something - the user exists and is an admin
      }

      if (!user.isAdmin) {
        // Do something - the user exists but is no admin user
      }

      // Hand over control to passport
      next();
    });
  };
}
// Login Page
router.get("/login", checkNotAuthenticated, (request, response) => {
  response.render("users/login");
});

// Login Handle
router.post("/login", checkNotAuthenticated, (request, response, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(request, response, next);
});

// Register Page
router.get("/register", checkNotAuthenticated, (request, response) => {
  response.render("users/register");
});

// Register Handle
router.post("/register", checkNotAuthenticated, (request, response) => {
  const { username, email, password, password2 } = request.body;
  let errors = [];

  if (!username || !email || !password) {
    errors.push({ msg: "Please enter all fields" });
  }

  // if (password != password2) {
  //   errors.push({ msg: "Passwords do not match" });
  // }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    response.render("users/register", {
      errors,
      username,
      email,
      password,
      // password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        response.render("users/register", {
          errors,
          username,
          email,
          password,
          // password2,
        });
      } else {
        const newUser = new User({
          username,
          email,
          password,
        });

        bcrypt.genSalt(10, (error, salt) => {
          bcrypt.hash(newUser.password, salt, (error, hash) => {
            if (error) throw error;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                request.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                response.redirect("/users/login");
              })
              .catch((error) => console.log(error));
          });
        });
      }
    });
  }
});

// Logout
router.get("/logout", (request, response) => {
  request.logout();
  request.flash("success_msg", "You are logged out");
  response.redirect("/");
});

module.exports = router;
