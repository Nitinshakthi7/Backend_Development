// Energy Reading Model - Stores time-series energy consumption data
const mongoose = require('mongoose');

const energyReadingSchema = new mongoose.Schema({
  homeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true
  },
  deviceId: { type: String, required: true },
  roomId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  consumption: { type: Number, required: true, min: 0 }, // kWh
  watts: { type: Number, required: true, min: 0 },       // Current power
  cost: { type: Number, default: 0 },
  isPeakHour: { type: Boolean, default: false }
});

// Create indexes for faster queries
energyReadingSchema.index({ homeId: 1, timestamp: -1 });
energyReadingSchema.index({ deviceId: 1, timestamp: -1 });

module.exports = mongoose.model('EnergyReading', energyReadingSchema);
