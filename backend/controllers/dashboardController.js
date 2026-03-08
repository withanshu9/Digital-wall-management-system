const User = require('../models/User');
const Wall = require('../models/Wall');
const Booking = require('../models/Booking');

exports.getAdminOverview = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalWalls = await Wall.countDocuments();
        const totalBookings = await Booking.countDocuments();

        // Revenue calculation
        const completedBookings = await Booking.find({ paymentStatus: 'completed' });
        const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
        const totalCommission = completedBookings.reduce((sum, b) => sum + b.commission, 0);

        res.json({
            totalUsers,
            totalWalls,
            totalBookings,
            totalRevenue,
            totalCommission
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOwnerOverview = async (req, res) => {
    try {
        const walls = await Wall.find({ owner: req.user.id });
        const wallIds = walls.map(w => w._id);

        const activeBookings = await Booking.countDocuments({
            wall: { $in: wallIds },
            bookingStatus: { $in: ['confirmed', 'active'] },
            endDate: { $gte: new Date() }
        });

        // Revenue calculation
        const completedBookings = await Booking.find({
            wall: { $in: wallIds },
            paymentStatus: 'completed'
        });
        const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.totalAmount - b.commission - b.gst), 0);

        res.json({
            totalWalls: walls.length,
            activeBookings,
            totalEarnings
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAdvertiserOverview = async (req, res) => {
    try {
        const activeCampaigns = await Booking.countDocuments({
            advertiser: req.user.id,
            bookingStatus: { $in: ['confirmed', 'active'] },
            endDate: { $gte: new Date() }
        });

        const completedBookings = await Booking.find({
            advertiser: req.user.id,
            paymentStatus: 'completed'
        });
        const totalSpend = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);

        res.json({
            activeCampaigns,
            totalSpend
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
