if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const initializePassport = require("./passport-config");

const mainRouter = require("./routes/main.js");
const userRouter = require("./routes/users");
const chronicleRouter = require("./routes/chronicle");
const lorebookRouter = require("./routes/lorebook");
const characterRouter = require("./routes/characters");
const app = express();

// DB Config
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(methodOverride("_method"));

app.use("/", mainRouter);
app.use("/users", userRouter);
app.use("/chronicle", chronicleRouter);
app.use("/lorebook", lorebookRouter);
app.use("/characters", characterRouter);
app.use(express.static(__dirname + "/public"));

app.listen(process.env.PORT || 3500);
