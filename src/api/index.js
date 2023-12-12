/* eslint-disable linebreak-style */
const express = require('express');

const auth = require('./auth');
const location = require('./location');
const users = require('./users');
const parcel = require('./parcel');
const middlewares = require('../middlewares');

const { verifyToken } = middlewares;

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/auth', auth);
router.use('/parcel', parcel);
router.use('/users', users);
router.use('/location', location)

module.exports = router;
