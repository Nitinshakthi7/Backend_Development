// Home Routes
const express = require('express');
const router = express.Router();
const {
  getHomes,
  getHome,
  createHome,
  updateHome,
  deleteHome,
  addRoom,
  addDevice
} = require('../controllers/homeController');
const { protect } = require('../middleware/auth');
const { validateHome } = require('../middleware/validator');

// All routes are protected
router.route('/')
  .get(protect, getHomes)
  .post(protect, validateHome, createHome);

router.route('/:id')
  .get(protect, getHome)
  .put(protect, updateHome)
  .delete(protect, deleteHome);

router.post('/:id/rooms', protect, addRoom);
router.post('/:homeId/rooms/:roomId/devices', protect, addDevice);

module.exports = router;
