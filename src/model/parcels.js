const mongoose = require('mongoose');
Schema = mongoose.Schema

const Parcel = new mongoose.Schema({
  sender: {
    type: Schema.ObjectId, 
    ref: 'User',
    required: true,
  },
  sender_location: {
    type: Number
  },
  sender_cabinent: {
    type: Number
  },
  reciver: {
    type: Schema.ObjectId, 
    ref: 'User',
    required: true,
  },
  reciver_location: {
    type: Number
  },
  reciver_cabinent: {
    type: Number
  },
  size: {
    type: String, 
    required: true,
  },
  mass: {
    type: String, 
    required: true,
  },
  name: {
    type: String, 
    required: true,
  },
  address: {
    type: String, 
    required: true,
  },
  phone_number: {
    type: String, 
    required: true,
  },
  delivery_status:{
    type: String, 
    required: true,
    default: 'RESERVED'
  },
  location: {
    type: Number,
  },
  notified:{
    type: Boolean, 
    required: true,
    default: false
  },
  cabinent: {
    type: Number,
  }
});

module.exports = mongoose.model('Parcel', Parcel);
