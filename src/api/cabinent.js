const express = require('express');
const mongoose = require('mongoose');
const generateRandomString = require('../utils/generate-code');
const Location = require('../model/Location');
const middlewares = require('../middlewares');

const { verifyToken } = middlewares;

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const locations = await Location.find({}, { location_id: 1, "cabinents.occupied": 1, "cabinents.id": 1 });
    res.status(201).send(locations);

  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/reseve-cabinent', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id
    const { location_id: locationId, cabinent_id: cabinentId } = req.body
    const key = generateRandomString()
    const updatedLocation = await Location.findOneAndUpdate({ location_id: locationId, cabinents: { $elemMatch: { id: cabinentId } } }, {
      $set: {
        'cabinents.$.occupied': true,
        'cabinents.$.key': key,
        'cabinents.$.user': userId
      }
    });
    res.status(201).send(updatedLocation);

  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
