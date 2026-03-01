const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const wallController = require('../controllers/wallController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Setup multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Public routes
router.get('/', wallController.getWalls);
router.get('/:id', wallController.getWallById);

// Owner routes
router.post('/', authMiddleware, roleMiddleware(['owner']), upload.array('images', 5), wallController.createWall);
router.put('/:id', authMiddleware, roleMiddleware(['owner']), wallController.updateWall);
router.delete('/:id', authMiddleware, roleMiddleware(['owner', 'admin']), wallController.deleteWall);
router.get('/owner/me', authMiddleware, roleMiddleware(['owner']), wallController.getOwnerWalls);

// Admin routes
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), wallController.getAllWallsAdmin);
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin']), wallController.updateWallStatus);

module.exports = router;
