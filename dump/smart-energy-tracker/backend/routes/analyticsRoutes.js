// Analytics Routes
const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getHeatmap,
  getDeviceAnalytics
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/dashboard/:homeId', protect, getDashboard);
router.get('/heatmap/:homeId', protect, getHeatmap);
router.get('/device/:homeId/:deviceId', protect, getDeviceAnalytics);

module.exports = router;
