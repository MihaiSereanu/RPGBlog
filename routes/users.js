if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");
const { checkAuthenticated, checkNotAuthenticated } = require("../config/auth");

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
router.post("/register", checkNotAuthenticated, async (request, response) => {
  const { username, email, password } = request.body;
  let errors = [];
  if (!username || !email || !password) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    response.render("users/register", { errors, username, email, password });
  } else {
    try {
      let user = await User.findOne({ email: email });
      if (user) {
        errors.push({ msg: "Email already exists" });
        response.render("users/register", { errors, username, password });
      }
      let newUser = new User({ username, email, password });
      bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(newUser.password, salt, async (error, hash) => {
          if (error) throw error;
          newUser.password = hash;
          newUser = await newUser.save();
          response.redirect("/users/login");
        });
      });
    } catch (error) {
      console.log(error);
      response.render("users/register", { errors, username, email, password });
    }
  }
});

// Logout
router.get("/logout", (request, response) => {
  request.logout();
  request.flash("success_msg", "You are logged out");
  response.redirect("/");
});

module.exports = router;
