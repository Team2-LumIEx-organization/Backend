const express = require('express');
const mongoose = require('mongoose');
// const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) res.status(400).send(error.details[0].message);
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send('Email already exists!');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = new User({
    email: req.body.email,
    password: hashedPassword,
    name: req.body.name
  });
  try {
    const savedUser = await user.save();
    createTokenSendResponse(savedUser, res)
  } catch (err) {
    // res.status(400).send(err);
  }
});

function createTokenSendResponse(user, res) {
  const payload = {
    _id: user._id,
    email: user.email,
    type: user.type,
    name: user.name
  };
  const token = jwt.sign(payload, 'TOKEN_SECRET', { expiresIn: '1d' });
  res.header('token', token).json({ token, _id: user._id, email: user.email });
}

router.post('/login', async (req, res, next) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) res.status(400).send(error.details[0].message);
    const user = await User.findOne({ email: req.body.email, is_deleted: false });
    if (!user) return res.status(400).send('Email or password is wrong!');
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Email or password is wrong!');

    createTokenSendResponse(user, res);
  } catch (error) {
    // next(error);
  }
});
router.post('/delete', async (req, res, next) => {
  try {
    await User.findOneAndUpdate({ email: req.body.email, is_deleted: true });
    return res.status(200).send('succeess');

  } catch (error) {
    next(error);
  }
});

module.exports = router;
