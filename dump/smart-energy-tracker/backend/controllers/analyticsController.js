// Analytics Controller - MongoDB aggregation queries for dashboard
const EnergyReading = require('../models/EnergyReading');
const Home = require('../models/Home');
const Alert = require('../models/Alert');

// Get dashboard analytics
exports.getDashboard = async (req, res) => {
  try {
    const { homeId } = req.params;
    const { period = 'today' } = req.query;

    // Verify ownership
    const home = await Home.findById(homeId);
    if (!home || home.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Calculate date range based on period
    let startDate;
    const endDate = new Date();

    switch (period) {
      case 'today':
        startDate = new Date(endDate);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      default:
        startDate = new Date(endDate);
        startDate.setHours(0, 0, 0, 0);
    }

    // Aggregate total consumption and cost
    const totals = await EnergyReading.aggregate([
      {
        $match: {
          homeId: home._id,
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalConsumption: { $sum: '$consumption' },
          totalCost: { $sum: '$cost' },
          avgWatts: { $avg: '$watts' },
          maxWatts: { $max: '$watts' }
        }
      }
    ]);

    // Get top 5 devices by consumption
    const topDevices = await EnergyReading.aggregate([
      {
        $match: {
          homeId: home._id,
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$deviceId',
          totalConsumption: { $sum: '$consumption' },
          totalCost: { $sum: '$cost' }
        }
      },
      { $sort: { totalConsumption: -1 } },
      { $limit: 5 }
    ]);

    // Get room breakdown
    const roomBreakdown = await EnergyReading.aggregate([
      {
        $match: {
          homeId: home._id,
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$roomId',
          totalConsumption: { $sum: '$consumption' },
          totalCost: { $sum: '$cost' }
        }
      },
      { $sort: { totalConsumption: -1 } }
    ]);

    // Get recent alerts
    const alerts = await Alert.find({
      homeId: home._id,
      isRead: false
    }).sort({ createdAt: -1 }).limit(5);

    // Calculate carbon footprint (India: 0.5 kg CO2 per kWh)
    const totalKwh = totals[0]?.totalConsumption || 0;
    const carbonFootprint = {
      co2kg: (totalKwh * 0.5).toFixed(2),
      treesEquivalent: (totalKwh * 0.5 / 21.77).toFixed(1)
    };

    res.status(200).json({
      success: true,
      data: {
        period,
        dateRange: { start: startDate, end: endDate },
        totals: totals[0] || { totalConsumption: 0, totalCost: 0, avgWatts: 0 },
        topDevices,
        roomBreakdown,
        alerts,
        carbonFootprint
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get heat map data for a month
exports.getHeatmap = async (req, res) => {
  try {
    const { homeId } = req.params;
    const { month } = req.query; // Format: YYYY-MM

    const home = await Home.findById(homeId);
    if (!home || home.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59);

    const heatmapData = await EnergyReading.aggregate([
      {
        $match: {
          homeId: home._id,
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          dailyTotal: { $sum: '$consumption' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: heatmapData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get device-specific analytics
exports.getDeviceAnalytics = async (req, res) => {
  try {
    const { homeId, deviceId } = req.params;
    const { days = 7 } = req.query;

    const home = await Home.findById(homeId);
    if (!home || home.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const deviceData = await EnergyReading.aggregate([
      {
        $match: {
          homeId: home._id,
          deviceId: deviceId,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          dailyConsumption: { $sum: '$consumption' },
          dailyCost: { $sum: '$cost' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        deviceId,
        period: `Last ${days} days`,
        dailyData: deviceData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
