'use strict';

// Import needed modules
const express = require("express"),
  app = express(),
  router = require("./routes/index"),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  expressValidator = require("express-validator"),
  passport = require("passport"),
  User = require("./models/user"),
  fileUpload = require('express-fileupload');

require("dotenv").config();

// Set application variables
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

// Mongoose database setup
if (process.env.NODE_ENV === "development")
  mongoose.connect(process.env.MONGO_DEV_URI);  // Atlas connection string for DEVELOPMENT db
else if (process.env.NODE_ENV === "production")
  mongoose.connect(process.env.MONGO_PROD_URI); // Atlas connection string for PRODUCTION db

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(layouts);

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);

app.use(express.json());
app.use(cookieParser("secret_passcode"));
app.use(
  expressSession({
    secret: "secret_passcode",
    cookie: {
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(connectFlash());

app.use(fileUpload());

app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  res.locals.cart = req.session.cart;
  next();
});
//app.use(expressValidator());

app.use("/", router);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});