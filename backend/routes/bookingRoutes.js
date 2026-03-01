const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Advertiser routes
router.post('/create', authMiddleware, roleMiddleware(['advertiser']), bookingController.createBooking);
router.post('/verify-payment', authMiddleware, roleMiddleware(['advertiser']), bookingController.verifyPayment);
router.get('/advertiser/me', authMiddleware, roleMiddleware(['advertiser']), bookingController.getAdvertiserBookings);

// Owner routes
router.get('/owner/me', authMiddleware, roleMiddleware(['owner']), bookingController.getOwnerBookings);
router.patch('/:id/status', authMiddleware, roleMiddleware(['owner']), bookingController.updateBookingStatus);

// Admin routes
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), bookingController.getAllBookingsAdmin);

module.exports = router;
