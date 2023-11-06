//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
const port = 3000;

// Connect to the MongoDB database (replace 'your-database-uri' with your MongoDB URI)
mongoose.connect(
  "mongodb+srv://Kartik:kartik123@cluster0.rx98gxr.mongodb.net/?retryWrites=true&w=majority"
);

// Create a Mongoose schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

// Create a Mongoose model based on the schema
const User = mongoose.model("User", userSchema);

// Set EJS as the view engine
app.set("view engine", "ejs");

// Use bodyParser to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Define a sample route to display a form
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// Define a new user registeration
app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  newUser
    .save()
    .then((savedUser) => {
      console.log("User saved:", savedUser);
      res.render("secrets");
    })
    .catch((error) => {
      console.error("Error saving user:", error);
    });
});

// user login

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username })
    .then((foundUser) => {
      if (foundUser && foundUser.password === password) {
        res.render("secrets");
      } else {
        res.render("login");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// Save the new user document to the database

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
