const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// All booking routes require authentication
router.post('/', auth, bookingController.createBooking);
router.get('/', auth, bookingController.getUserBookings);
router.get('/:bookingId', auth, bookingController.getBookingById);
router.delete('/:bookingId', auth, bookingController.cancelBooking);

// Admin route to release expired bookings (optional)
router.post('/admin/release-expired', auth, bookingController.releaseExpiredBookings);

module.exports = router;
