const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/User');

const { adminValidation } = require('../validation/auth');


const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    const result = adminValidation(req.body);
    if (!result.error) {
      const query = { _id };
      const users = await User.findOne(query, '-password');
      if (users) {
        const updatedUser = req.body;
        if (updatedUser.password) {
          const salt = await bcrypt.genSalt(10);
          updatedUser.password = await bcrypt.hash(updatedUser.password, salt);
        }
        await User.updateOne(query, {
          $set: updatedUser,
        });
        res.json(updatedUser);
      } else {
        next();
      }
    } else {
      res.status(422);
      throw new Error(result.error);
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.remove({ _id: id });
    res.json({
      message: 'Success',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
