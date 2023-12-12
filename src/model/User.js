const { boolean } = require('joi');
const mongoose = require('mongoose');

const User = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    max: 50,
    min: 6
  },
  password: {
    type: String,
    required: true,
    max: 200,
    min: 6,
  },
   name: {
    type: String,
    max: 200,
    min: 6,
  },
  type: {
    type: String,
    required: true,
    default: 'CUSTOMER'
  },
  is_deleted: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = mongoose.model('User', User);
