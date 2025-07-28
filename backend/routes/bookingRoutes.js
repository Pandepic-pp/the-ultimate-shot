const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getAllBookings
} = require('../controllers/bookingController');

router.post('/booking', createBooking);
router.post('/my-booking', getUserBookings);
router.get('/get-all-bookings', getAllBookings);

module.exports = router;
