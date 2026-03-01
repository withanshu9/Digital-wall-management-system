const Wall = require('../models/Wall');

// Get all walls (public listing)
exports.getWalls = async (req, res) => {
    try {
        const filters = { status: 'approved' };

        if (req.query.city) filters.city = req.query.city;
        if (req.query.type) filters.type = req.query.type;
        if (req.query.availability) filters.availability = req.query.availability;

        const walls = await Wall.find(filters).populate('owner', 'name email');
        res.json(walls);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single wall
exports.getWallById = async (req, res) => {
    try {
        const wall = await Wall.findById(req.params.id).populate('owner', 'name email');
        if (!wall) return res.status(404).json({ message: 'Wall not found' });
        res.json(wall);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create wall (Owner only)
exports.createWall = async (req, res) => {
    try {
        const { title, type, locationType, trafficLevel, city, location, width, height, pricingType, basePrice, trafficEstimate, link } = req.body;

        // Process image uploads if available
        let images = [];
        if (req.body.images && Array.isArray(req.body.images) && req.body.images.length > 0) {
            images = req.body.images;
        } else if (req.files && req.files.length > 0) {
            images = req.files.map(file => `/uploads/${file.filename}`);
        } else {
            // Dummy images for testing based on type
            images = ['https://images.unsplash.com/photo-1542204637-e67bc7d41e48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'];
        }

        const wall = new Wall({
            title, type, locationType, trafficLevel, city, location, width, height, pricingType, basePrice, trafficEstimate, link,
            images,
            owner: req.user.id
        });

        await wall.save();
        res.status(201).json(wall);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update wall (Owner only)
exports.updateWall = async (req, res) => {
    try {
        const wall = await Wall.findById(req.params.id);
        if (!wall) return res.status(404).json({ message: 'Wall not found' });

        if (wall.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to update this wall' });
        }

        const updatedWall = await Wall.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedWall);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete wall (Owner only)
exports.deleteWall = async (req, res) => {
    try {
        const wall = await Wall.findById(req.params.id);
        if (!wall) return res.status(404).json({ message: 'Wall not found' });

        if (wall.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'User not authorized to delete this wall' });
        }

        await Wall.findByIdAndDelete(req.params.id);
        res.json({ message: 'Wall removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin routes
exports.getAllWallsAdmin = async (req, res) => {
    try {
        const walls = await Wall.find().populate('owner', 'name email');
        res.json(walls);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateWallStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const wall = await Wall.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!wall) return res.status(404).json({ message: 'Wall not found' });
        res.json(wall);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Owner routes
exports.getOwnerWalls = async (req, res) => {
    try {
        const walls = await Wall.find({ owner: req.user.id });
        res.json(walls);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
