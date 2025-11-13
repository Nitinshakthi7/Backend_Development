// Home Controller - CRUD operations for homes and devices
const Home = require('../models/Home');

// Get all homes for logged in user
exports.getHomes = async (req, res) => {
  try {
    const homes = await Home.find({ userId: req.user.id });

    res.status(200).json({
      success: true,
      count: homes.length,
      data: homes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single home by ID
exports.getHome = async (req, res) => {
  try {
    const home = await Home.findById(req.params.id);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: 'Home not found'
      });
    }

    // Check if user owns this home
    if (home.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      data: home
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new home
exports.createHome = async (req, res) => {
  try {
    // Attach userId to request body
    req.body.userId = req.user.id;

    const home = await Home.create(req.body);

    res.status(201).json({
      success: true,
      data: home
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update home
exports.updateHome = async (req, res) => {
  try {
    let home = await Home.findById(req.params.id);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: 'Home not found'
      });
    }

    // Check ownership
    if (home.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update home
    home = await Home.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: home
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete home
exports.deleteHome = async (req, res) => {
  try {
    const home = await Home.findById(req.params.id);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: 'Home not found'
      });
    }

    // Check ownership
    if (home.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await home.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add room to home
exports.addRoom = async (req, res) => {
  try {
    const home = await Home.findById(req.params.id);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: 'Home not found'
      });
    }

    // Check ownership
    if (home.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Add room to rooms array
    home.rooms.push(req.body);
    await home.save();

    res.status(201).json({
      success: true,
      data: home
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add device to room
exports.addDevice = async (req, res) => {
  try {
    const home = await Home.findById(req.params.homeId);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: 'Home not found'
      });
    }

    // Check ownership
    if (home.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Find the room
    const room = home.rooms.id(req.params.roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Add device to room's devices array
    room.devices.push(req.body);
    await home.save();

    res.status(201).json({
      success: true,
      data: home
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
