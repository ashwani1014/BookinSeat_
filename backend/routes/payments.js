const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// All payment routes require authentication
router.post('/bookings/:bookingId/payment', auth, paymentController.processPayment);
router.get('/bookings/:bookingId/payment/status', auth, paymentController.getPaymentStatus);

module.exports = router;
