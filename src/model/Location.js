const mongoose = require('mongoose');

const Locations = new mongoose.Schema({
  location_id: {
    type: Number,
    required: true
  },
  cabinents: [{}]
});

module.exports = mongoose.model('Locations', Locations);
