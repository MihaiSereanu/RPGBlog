const express = require("express");
const router = express.Router();

// Login Page
router.get("/login", (request, response) => {
  response.render("users/login");
});

// Register Page
router.get("/register", (request, response) => {
  response.render("users/register");
});

// Register Handle
router.post("/register", (request, response) => {
  const { username, email, password, password2 } = request.body;
  let errors = [];
  // Check required fields
  if (!username || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all the fields" });
  }
  // Check passwords
  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }
  // Check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    response.render("users/register", {
      errors,
      username,
      email,
      password,
      password2,
    });
  } else {
    response.redirect("/");
  }
});

module.exports = router;
