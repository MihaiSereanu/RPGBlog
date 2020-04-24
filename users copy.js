if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
// const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const User = require("../models/user");
const initializePassport = require("../passport-config");

initializePassport(
  passport,
  // use mongo functions here??
  (email) => {
    User.findOne({ email: email });
  },
  (id) => User.findOne({ id: id })
);

// USER CONFIG //
router.use(flash());
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ url: "mongodb://localhost/rpgblog" }),
    // store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

router.use(passport.initialize());
router.use(passport.session());

// Login Page
router.get("/login", (request, response) => {
  response.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

// Register Page
router.get("/register", (request, response) => {
  response.render("users/register");
});

// Register Handle
router.post(
  "/register",
  async (request, response, next) => {
    request.user = new User();
    next();
  },
  saveUserAndRedirect("login")
);

function saveUserAndRedirect(path) {
  return async (request, response) => {
    const hashedPassword = await bcrypt.hash(request.body.password, 10);
    let user = request.user;
    user.username = request.body.username;
    user.email = request.body.email;
    user.password = hashedPassword;
    user.date = request.body.date;
    try {
      newUser = await user.save();
      response.render(`users/${path}`);
    } catch (error) {
      console.log(error);
      response.redirect(`users/register`, { user: user });
    }
    console.log(user);
  };
}

module.exports = router;
