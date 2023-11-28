/* eslint-disable linebreak-style */
const express = require('express');

const auth = require('./auth');
const users = require('./users');
const middlewares = require('../middlewares');

const { verifyToken } = middlewares;

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/auth', auth);
router.use('/users', users);

module.exports = router;
