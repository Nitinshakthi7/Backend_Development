// Home Model - Stores home and device information using embedded documents
const mongoose = require('mongoose');

// Sub-schema for devices
const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['hvac', 'lighting', 'appliance', 'entertainment', 'other'],
    required: true
  },
  wattage: { type: Number, required: true },
  isActive: { type: Boolean, default: false }
});

// Sub-schema for rooms
const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['bedroom', 'kitchen', 'living_area', 'bathroom', 'other'],
    required: true
  },
  devices: [deviceSchema] // Embedded devices array
});

// Main home schema
const homeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  address: String,
  rooms: [roomSchema], // Embedded rooms array
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Home', homeSchema);
