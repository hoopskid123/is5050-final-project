"use strict";

// Import needed modules
const express = require("express"),
  app = express(),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  mongoose = require("mongoose"),
  layouts = require("express-ejs-layouts");

// Set application variables
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

// Mongoose database setup
mongoose.connect(
  "mongodb+srv://admin:DevPass$8@is5050-cluster.eqzfs.mongodb.net/covert_tees?retryWrites=true&w=majority",
);
const db = mongoose.connection;
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose")
});

// Mongoose Promises
mongoose.Promise = global.Promise;

// Set up application middleware
app.use(express.static("public"));
app.use(layouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes for pages
app.get("/index", homeController.index);
app.get("/about", homeController.about);
app.get("/shop", homeController.shop);
app.get("/shop-single", homeController.shopSingle);
app.get("/contact", homeController.contact);


// Set up error handling middleware at the end
// These should only be applied if no other routes apply
app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);


// Launch the server
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
