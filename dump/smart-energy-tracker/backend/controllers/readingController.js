// Energy Reading Controller - Handles energy data submission
const EnergyReading = require('../models/EnergyReading');
const Home = require('../models/Home');
const User = require('../models/User');

// Submit single energy reading
exports.createReading = async (req, res) => {
  try {
    const { homeId, deviceId, roomId, consumption, watts } = req.body;

    // Verify home ownership
    const home = await Home.findById(homeId);
    if (!home || home.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Get user's electricity rate
    const user = await User.findById(req.user.id);
    const currentHour = new Date().getHours();
    const isPeakHour = user.electricityRate.peakHours.includes(currentHour);
    const rate = isPeakHour ? user.electricityRate.peakRate : user.electricityRate.offPeakRate;

    // Calculate cost
    const cost = consumption * rate;

    // Create reading
    const reading = await EnergyReading.create({
      homeId,
      deviceId,
      roomId,
      consumption,
      watts,
      cost,
      isPeakHour,
      timestamp: req.body.timestamp || new Date()
    });

    res.status(201).json({
      success: true,
      data: reading
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Submit batch readings (for testing)
exports.createBatchReadings = async (req, res) => {
  try {
    const { homeId, readings } = req.body;

    // Verify home ownership
    const home = await Home.findById(homeId);
    if (!home || home.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const user = await User.findById(req.user.id);

    // Process each reading
    const processedReadings = readings.map(r => {
      const hour = new Date(r.timestamp || Date.now()).getHours();
      const isPeakHour = user.electricityRate.peakHours.includes(hour);
      const rate = isPeakHour ? user.electricityRate.peakRate : user.electricityRate.offPeakRate;

      return {
        homeId,
        deviceId: r.deviceId,
        roomId: r.roomId,
        consumption: r.consumption,
        watts: r.watts,
        cost: r.consumption * rate,
        isPeakHour,
        timestamp: r.timestamp || new Date()
      };
    });

    // Insert all readings
    const inserted = await EnergyReading.insertMany(processedReadings);

    res.status(201).json({
      success: true,
      count: inserted.length,
      data: inserted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get latest readings for a home
exports.getLatestReadings = async (req, res) => {
  try {
    const home = await Home.findById(req.params.homeId);
    
    if (!home || home.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const readings = await EnergyReading.find({ homeId: req.params.homeId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: readings.length,
      data: readings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
