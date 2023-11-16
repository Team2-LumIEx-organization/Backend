const express = require("express");
const mongoose = require("mongoose");
//const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation/auth");

// Create an instance of the Express router
const router = express.Router();

// Define a route for user registration
router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) res.status(400).send(error.details[0].message);
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists!");
  // Generate a salt and hash the user's password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  // Create a new User instance with the email and hashed password
  const user = new User({
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    // Save the user to the database
    const savedUser = await user.save();
    // Create a token and send a response with the token and user information
    createTokenSendResponse(savedUser, res);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Function to create a JWT token and send it as part of the response
//a common pattern in token-based authentication systems
function createTokenSendResponse(user, res) {
  // Define the payload for the JWT
  const payload = {
    _id: user._id,
    email: user.email,
  };
  // Create a JWT token using the jwt.sign method
  // 'TOKEN_SECRET' is a placeholder; in practice, you should use a securely stored secret or key
  // { expiresIn: '1d' } specifies that the token will expire after one day.
  const token = jwt.sign(payload, "TOKEN_SECRET", { expiresIn: "1d" });
  // Set the 'token' header in the response
  // Send a JSON response with the token and other user information
  res.header("token", token).json({ token, _id: user._id, email: user.email });
}

// Define a route for user login
router.post("/login", async (req, res, next) => {
  try {
    // Validate the incoming login data using Joi schema
    const { error } = loginValidation(req.body);
    if (error) res.status(400).send(error.details[0].message);
    // Find the user in the database based on the provided email
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Unable to login!");
    // Compare the provided password with the hashed password in the database
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Email or password is wrong!");
    console.log("asd3");
    // If the password is valid, create a token and send the response
    createTokenSendResponse(user, res);
  } catch (error) {
    next(error);
  }
});

// Export the router for use in other parts of the application
module.exports = router;
