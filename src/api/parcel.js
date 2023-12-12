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
      name, address, phone_number, reciver_location, reciver_cabinent, sender_location, sender_cabinent } = req.body
    const reciverUser = await User.findOne({ email: reciver });
    if (!reciverUser) return res.status(400).send("reciever doesn't exists!");
    const userId = req.user._id
    const key = generateRandomString()
    const recieverKey = generateRandomString()
    // const reciverLocationCabinents = await Location.findOne(
    //   { location_id: Number(reciver_location), cabinents: { $elemMatch: { 'occupied': false } } },
    //   { 'cabinents.$': 1 })

    // const senderLocationCabinents = await Location.findOne(
    //   { location_id: Number(sender_location), cabinents: { $elemMatch: { 'occupied': false } } },
    //   { 'cabinents.$': 1 })
    // if (!reciverLocationCabinents) return res.status(400).send("no cabinents left for reciever Location");
    // if (!senderLocationCabinents) return res.status(400).send("no cabinents left for your location");
    console.log('test')

    const parcel = await new Parcel({
      reciver: reciverUser._id,
      sender_location: Number(sender_location),
      sender_cabinent: sender_cabinent,
      sender: userId,
      reciver_location: Number(reciver_location),
      reciver_cabinent: reciver_cabinent,
      size: x + ',' + y + ',' + z,
      mass,
      name,
      address,
      phone_number
    });

    parcel.save()
    await Location.findOneAndUpdate({ location_id: Number(sender_location), cabinents: { $elemMatch: { id: sender_cabinent } } }, {
      $set: {
        'cabinents.$.occupied': true,
        'cabinents.$.key': key,
        'cabinents.$.user': userId,
        'cabinents.$.parcel': parcel._id
      }
    });
    await Location.findOneAndUpdate({ location_id: Number(reciver_location), cabinents: { $elemMatch: { id: reciver_cabinent } } }, {
      $set: {
        'cabinents.$.occupied': true,
        'cabinents.$.key': recieverKey,
        'cabinents.$.user': reciverUser._id,
        'cabinents.$.parcel': parcel._id
      }
    });

    res.status(201).send({ parcel });

  } catch (err) {
    // res.status(400).send(err);
  }
});
router.get('/sent', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id
    const parcels = await Parcel.find({ sender: userId }).populate('reciver', 'email').populate('sender', 'email').sort({ _id: -1 });
    res.status(201).send(parcels);
  } catch (err) {
    res.status(400).send(err);
  }
});
router.get('/recived', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id
    const parcels = await Parcel.find({ reciver: userId }).populate('reciver', 'email').populate('sender', 'email').sort({ _id: -1 });
    res.status(201).send(parcels);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/notifications', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id
    const parcels = await Parcel.find({ reciver: userId, delivery_status: 'READY_TO_PICKUP', notified: false }).populate('reciver', 'email').populate('sender', 'email').sort({ _id: -1 });
    res.status(201).send(parcels);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/remove-notifications', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id
    const parcels = await Parcel.updateMany({ reciver: userId, delivery_status: 'READY_TO_PICKUP', notified: false }, {$set: {notified: true}});
    res.status(201).send(parcels);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/driver/:status', verifyToken, async (req, res) => {
  try {
    const userType = req.user.type
    const status = req.params.status
    if (userType !== 'DRIVER') {
      return res.status(403).send('Not Allowed');
    }
    let parcels = []
    if (status === 'ontheway') {
      parcels = await Parcel.find({ delivery_status: 'READY_TO_PICKUP_BY_DRIVER' }).populate('reciver', 'email').populate('sender', 'email');
    }
    if (status === 'pickup') {
      parcels = await Parcel.find({ delivery_status: 'ON_THE_WAY'  }).populate('reciver', 'email').populate('sender', 'email');
    }
    res.status(201).send(parcels);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
