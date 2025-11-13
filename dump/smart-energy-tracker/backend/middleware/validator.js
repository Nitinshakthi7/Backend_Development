// Input Validation Middleware

// Validate energy reading data
exports.validateReading = (req, res, next) => {
  const { deviceId, consumption, watts } = req.body;

  // Check if all required fields exist
  if (!deviceId || typeof deviceId !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'deviceId is required'
    });
  }

  if (consumption === undefined || consumption < 0) {
    return res.status(400).json({
      success: false,
      message: 'consumption must be a positive number'
    });
  }

  if (watts === undefined || watts < 0) {
    return res.status(400).json({
      success: false,
      message: 'watts must be a positive number'
    });
  }

  next(); // Validation passed
};

// Validate home creation
exports.validateHome = (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Home name is required'
    });
  }

  next();
};
