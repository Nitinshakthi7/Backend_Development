// Energy Reading Routes
const express = require('express');
const router = express.Router();
const {
  createReading,
  createBatchReadings,
  getLatestReadings
} = require('../controllers/readingController');
const { protect } = require('../middleware/auth');
const { validateReading } = require('../middleware/validator');

router.post('/', protect, validateReading, createReading);
router.post('/batch', protect, createBatchReadings);
router.get('/latest/:homeId', protect, getLatestReadings);

module.exports = router;
