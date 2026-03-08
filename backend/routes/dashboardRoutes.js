const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Admin Analytics
router.get('/admin', authMiddleware, roleMiddleware(['admin']), dashboardController.getAdminOverview);

// Owner Analytics
router.get('/owner', authMiddleware, roleMiddleware(['owner']), dashboardController.getOwnerOverview);

// Advertiser Analytics
router.get('/advertiser', authMiddleware, roleMiddleware(['advertiser']), dashboardController.getAdvertiserOverview);

module.exports = router;
