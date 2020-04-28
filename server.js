if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");

const userRouter = require("./routes/users");
const chronicleRouter = require("./routes/chronicle");
const lorebookRouter = require("./routes/lorebook");
const characterRouter = require("./routes/characters");
const app = express();

// Passport Config //
require("./config/passport")(passport);

// DB CONFIG //
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((error) => handleError(error));

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(methodOverride("_method"));

app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Passing this to every route to dynamically check for user state
app.use(function (request, response, next) {
  response.locals.isAuthenticated = request.isAuthenticated();
  next();
});

app.get("/", async (request, response) => {
  response.render("main.ejs");
});

app.use("/users", userRouter);
app.use("/chronicle", chronicleRouter);
app.use("/lorebook", lorebookRouter);
app.use("/characters", characterRouter);
app.use(express.static(__dirname + "/public"));

app.listen(process.env.PORT || 3500);
