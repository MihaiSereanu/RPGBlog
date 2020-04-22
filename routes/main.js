const express = require("express");
const router = express.Router();

module.exports = router;

// Main Page
router.get("/", async (request, response) => {
  response.render("main");
});
