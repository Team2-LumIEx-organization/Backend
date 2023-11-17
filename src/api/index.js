/* eslint-disable linebreak-style */
const express = require("express");

const auth = require("./auth");
const users = require("./users");
const middlewares = require("../middlewares");

const { verifyToken } = middlewares; // a middleware that checks the validity of a JWT token, often used for authentication.

const router = express.Router();

//Define a default route for the root endpoint ('/') that responds with a JSON message.
router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/auth", auth);
router.use("/users", users);

module.exports = router;
