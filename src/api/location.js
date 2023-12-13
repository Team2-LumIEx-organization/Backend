const express = require("express");
const mongoose = require("mongoose");
const generateRandomString = require("../utils/generate-code");
const Location = require("../model/Location");
const Parcel = require("../model/parcels");
const middlewares = require("../middlewares");
const { unLockValidation } = require("../validation/location");

const { verifyToken } = middlewares;

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const locations = await Location.find(
      {},
      { location_id: 1, "cabinents.occupied": 1, "cabinents.id": 1 }
    );
    res.status(201).send(locations);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/:locationId/:cabinentId", verifyToken, async (req, res) => {
  try {
    const locationId = req.params.locationId;
    const cabinentId = req.params.cabinentId;
    const location = await Location.find(
      { location_id: locationId },
      {
        location_id: 1,
        "cabinents.occupied": 1,
        "cabinents.id": 1,
        "cabinents.key": 1,
        "cabinents.user": 1,
      }
    );
    let key = "";
    console.log("req.user", location[0].cabinents);

    location[0].cabinents.map((item) => {
      if (item.id === Number(cabinentId)) {
        key = item.key;
      }
    });
    res.status(201).send(key);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.post("/unlock", async (req, res) => {
  try {
    const { error } = unLockValidation(req.body);
    if (error) res.status(400).send(error.details[0].message);
    const { locationId, cabinentId, key } = req.body;
    const location = await Location.find(
      { location_id: locationId },
      {
        location_id: 1,
        "cabinents.occupied": 1,
        "cabinents.id": 1,
        "cabinents.key": 1,
        "cabinents.user": 1,
        "cabinents.parcel": 1,
      }
    );
    let cabinentKey = "";
    let cabinentParcel = "";

    location[0].cabinents.map((item) => {
      if (item.id === Number(cabinentId)) {
        cabinentKey = item.key;
        cabinentParcel = item.parcel;
      }
    });
    let parcel;
    if (cabinentParcel) {
      parcel = await Parcel.findById(cabinentParcel);
    }
    if (key === "I_AM_THE_BEST_DRIVER") {
      if (!parcel) {
        return res.status(403).send("wrong-code");
      }
      if (parcel.delivery_status === "READY_TO_PICKUP_BY_DRIVER") {
        await Parcel.findByIdAndUpdate(cabinentParcel, {
          $set: { delivery_status: "ON_THE_WAY" },
        });
        await Location.findOneAndUpdate(
          {
            location_id: Number(locationId),
            cabinents: { $elemMatch: { id: Number(cabinentId) } },
          },
          {
            $set: {
              "cabinents.$.occupied": false,
              "cabinents.$.key": "",
              "cabinents.$.user": "",
              "cabinents.$.parcel": "",
            },
          }
        );
        return res.status(201).send(key);
      }
      if (parcel.delivery_status === "ON_THE_WAY") {
        await Parcel.findByIdAndUpdate(cabinentParcel, {
          $set: { delivery_status: "READY_TO_PICKUP" },
        });
        return res.status(201).send(key);
      }
      return res.status(403).send("wrong-code");
    } else {
      if (cabinentKey !== key) {
        return res.status(403).send("wrong-code");
      }
      if (parcel.delivery_status === "RESERVED") {
        await Parcel.findByIdAndUpdate(cabinentParcel, {
          $set: { delivery_status: "READY_TO_PICKUP_BY_DRIVER" },
        });
      }
      if (parcel.delivery_status === "READY_TO_PICKUP") {
        await Parcel.findByIdAndUpdate(cabinentParcel, {
          $set: { delivery_status: "DELIVERED" },
        });
        await Location.findOneAndUpdate(
          {
            location_id: Number(locationId),
            cabinents: { $elemMatch: { id: Number(cabinentId) } },
          },
          {
            $set: {
              "cabinents.$.occupied": false,
              "cabinents.$.key": "",
              "cabinents.$.user": "",
              "cabinents.$.parcel": "",
            },
          }
        );
      }

      res.status(201).send(key);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.post("/reseve-cabinent", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { location_id: locationId, cabinent_id: cabinentId } = req.body;
    const key = generateRandomString();
    const updatedLocation = await Location.findOneAndUpdate(
      {
        location_id: locationId,
        cabinents: { $elemMatch: { id: cabinentId } },
      },
      {
        $set: {
          "cabinents.$.occupied": true,
          "cabinents.$.key": key,
          "cabinents.$.user": userId,
        },
      }
    );
    res.status(201).send(updatedLocation);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
