const Booking = require('../models/Booking');
const Wall = require('../models/Wall');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy'
});

// Calculate Price Utility
const calculatePrice = (wall, startDate, endDate, units) => {
    let baseCost = 0;

    if (wall.pricingType === 'monthly') {
        baseCost = wall.basePrice * units;
    } else if (wall.pricingType === 'per sq ft') {
        baseCost = wall.basePrice * wall.area;
    } else if (wall.pricingType === 'per day') {
        baseCost = wall.basePrice * units;
    }

    // Calculate days for impressions
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const totalImpressions = wall.trafficEstimate * diffDays;
    const cpm = totalImpressions > 0 ? (baseCost / totalImpressions) * 1000 : 0;

    // Additional costs (dummy fixed values for logic, can be made dynamic later)
    const seasonalIncrease = baseCost * 0.10; // 10%
    const permitFees = 5000;
    const installationFees = 15000;

    const subtotal = baseCost + seasonalIncrease + permitFees + installationFees;
    const gst = subtotal * 0.18; // 18% GST

    const totalAmount = subtotal + gst;
    const commission = totalAmount * 0.10; // 10% Platform commission

    return {
        baseCost, seasonalIncrease, permitFees, installationFees, gst, totalAmount, commission, totalImpressions, cpm
    };
};

// Create Booking & Razorpay Order
exports.createBooking = async (req, res) => {
    try {
        const { wallId, startDate, endDate, units } = req.body;

        const wall = await Wall.findById(wallId);
        if (!wall) return res.status(404).json({ message: 'Wall not found' });
        if (wall.availability === 'booked') return res.status(400).json({ message: 'Wall is already booked' });

        const pricing = calculatePrice(wall, startDate, endDate, units);

        // Create Razorpay Order if keys are valid, otherwise bypass for test demo
        let orderOptions = {
            amount: Math.round(pricing.totalAmount * 100), // in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        let razorpayOrderId = "dummy_order_id";
        if (process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('dummy')) {
            const order = await razorpay.orders.create(orderOptions);
            razorpayOrderId = order.id;
        }

        const booking = new Booking({
            wall: wall._id,
            advertiser: req.user.id,
            owner: wall.owner,
            startDate, endDate, units,
            ...pricing,
            razorpayOrderId
        });

        await booking.save();

        res.status(201).json({
            booking,
            razorpayOrderId,
            amount: pricing.totalAmount,
            currency: "INR",
            keyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Skip verification if strictly testing without valid real keys
        let isValid = false;
        if (process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET.includes('dummy')) {
            isValid = true;
        } else {
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');

            isValid = expectedSignature === razorpay_signature;
        }

        if (isValid) {
            booking.status = 'pending_approval'; // Payment successful, wait for owner
            booking.razorpayPaymentId = razorpay_payment_id || 'dummy_payment_id';
            await booking.save();

            // Update wall status
            await Wall.findByIdAndUpdate(booking.wall, { availability: 'booked' });

            res.json({ message: 'Payment verified successfully', booking });
        } else {
            res.status(400).json({ message: 'Invalid payment signature' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Bookings for Advertiser
exports.getAdvertiserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ advertiser: req.user.id })
            .populate('wall', 'title type images')
            .populate('owner', 'name');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Bookings for Owner
exports.getOwnerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ owner: req.user.id })
            .populate('wall', 'title type images')
            .populate('advertiser', 'name email');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Owner approves/rejects booking
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        booking.status = status;
        await booking.save();

        if (status === 'rejected') {
            await Wall.findByIdAndUpdate(booking.wall, { availability: 'available' });
        }

        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin gets all bookings for analytics
exports.getAllBookingsAdmin = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('wall')
            .populate('advertiser', 'name')
            .populate('owner', 'name');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
