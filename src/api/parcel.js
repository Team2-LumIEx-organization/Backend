const express = require('express');
const mongoose = require('mongoose');
const generateRandomString = require('../utils/generate-code');
const Location = require('../model/Location');
const Parcel = require('../model/parcels');
const middlewares = require('../middlewares');
const { createParcelValidation } = require('../validation/parcel');
const User = require('../model/User');

const { verifyToken } = middlewares;

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const { error } = createParcelValidation(req.body)
    if (error) res.status(400).send(error.details[0].message);
    const { reciver, x, y, z, mass,
      name, address, phone_number, reciver_location, sender_location } = req.body
    const reciverUser = await User.findOne({ email: reciver });
    if (!reciverUser) return res.status(400).send("reciever doesn't exists!");
    const userId = req.user._id
    const key = generateRandomString()
    const reciverLocationCabinents = await Location.findOne(
      { location_id: Number(reciver_location), cabinents: { $elemMatch: { 'occupied': false } } },
      { 'cabinents.$': 1 })

    const senderLocationCabinents = await Location.findOne(
      { location_id: Number(sender_location), cabinents: { $elemMatch: { 'occupied': false } } },
      { 'cabinents.$': 1 })
    if (!reciverLocationCabinents) return res.status(400).send("no cabinents left for reciever Location");
    if (!senderLocationCabinents) return res.status(400).send("no cabinents left for your location");
    await Location.findOneAndUpdate({ location_id: Number(reciver_location), cabinents: { $elemMatch: { id: reciverLocationCabinents.cabinents[0].id } } }, {
      $set: {
        'cabinents.$.occupied': true,
        'cabinents.$.key': key,
        'cabinents.$.user': userId
      }
    });
    console.log('test')

    const parcel = await new Parcel({
      reciver: reciverUser._id,
      sender_location: Number(sender_location),
      sender_cabinent: senderLocationCabinents.cabinents[0].id,
      sender: userId,
      reciver_location: Number(reciver_location),
      reciver_cabinent: reciverLocationCabinents.cabinents[0].id,
      size: x + ',' + y + ',' + z,
      mass,
      name,
      address,
      phone_number
    });


    parcel.save()

    res.status(201).send({ parcel });

  } catch (err) {
    // res.status(400).send(err);
  }
});
router.get('/sent', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id
    const parcels = await Parcel.find({ sender: userId });
    res.status(201).send(parcels);
  } catch (err) {
    res.status(400).send(err);
  }
});
router.get('/recived', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id
    const parcels = await Parcel.find({ reciver: userId });
    res.status(201).send(parcels);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
