const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../model/User");
//The routes include validation, password hashing, and appropriate error handling.
const { adminValidation } = require("../validation/auth");
//A validation function from ../validation/auth (likely using Joi) for validating data related to admin actions.

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}, "-password"); //It attempts to fetch all users from the database using User.find({}).
    res.json(users); //If successful, it responds with a JSON array of users
  } catch (error) {
    next(error); //If there's an error, it passes the error to the next middleware.
  }
});

router.patch("/:id", async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    const result = adminValidation(req.body); // Validate the request body using the adminValidation function
    if (!result.error) {
      const query = { _id }; // If validation passes, create a query to find the user by ID
      const users = await User.findOne(query, "-password"); // Attempt to find the user in the database, excluding the password field
      if (users) {
        const updatedUser = req.body; // If the user is found, update the user data based on the request body
        // If the updated user includes a password, hash it using bcrypt
        if (updatedUser.password) {
          const salt = await bcrypt.genSalt(10);
          updatedUser.password = await bcrypt.hash(updatedUser.password, salt);
        }
        // Use the updateOne method to update the user in the database
        await User.updateOne(query, {
          $set: updatedUser,
        });
        res.json(updatedUser); // Respond with the updated user data
      } else {
        next(); // If no user is found with the provided ID, move to the next middleware
      }
    } else {
      res.status(422); // If validation fails, respond with a 422 status and an error message
      throw new Error(result.error);
    }
  } catch (error) {
    next(error); // If an error occurs during the process, pass it to the next middleware
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.remove({ _id: id });
    res.json({
      message: "Success",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
