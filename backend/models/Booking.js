const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    wall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wall',
        required: true
    },
    advertiser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    units: {
        type: Number, // days, months, or area (sq ft) depending on Wall pricing type
        required: true
    },
    baseCost: {
        type: Number,
        required: true
    },
    seasonalIncrease: {
        type: Number,
        default: 0
    },
    permitFees: {
        type: Number,
        default: 0
    },
    installationFees: {
        type: Number,
        default: 0
    },
    gst: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    commission: {
        type: Number,
        required: true
    },
    bookingStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    expiresAt: {
        type: Date,
        expires: 0
    },
    razorpayOrderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    },
    cpm: {
        type: Number, // Cost per Mille (thousands) impressions for this campaign
    },
    totalImpressions: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
