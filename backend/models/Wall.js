const mongoose = require('mongoose');

const wallSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String, // e.g., 'Static Painted Wall', 'LED Video Wall'
        required: true
    },
    locationType: {
        type: String, // e.g., 'Commercial Area', 'Highway', 'Metro/Bus Stand'
        required: true
    },
    trafficLevel: {
        type: String, // e.g., 'High Traffic', 'Medium Traffic', '24/7 Visibility'
        required: true
    },
    city: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    width: {
        type: Number, // in feet or meters
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    area: {
        type: Number // calculated automatically
    },
    pricingType: {
        type: String,
        enum: ['monthly', 'per sq ft', 'per day'],
        required: true
    },
    basePrice: {
        type: Number,
        required: true
    },
    trafficEstimate: {
        type: Number, // daily traffic for CPM calculation
        default: 0
    },
    link: {
        type: String // optional link feature
    },
    images: [{
        type: String // URLs or file paths
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending_approval', 'approved', 'rejected'],
        default: 'pending_approval'
    },
    availability: {
        type: String,
        enum: ['available', 'booked'],
        default: 'available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

wallSchema.pre('save', function (next) {
    if (this.width && this.height) {
        this.area = this.width * this.height;
    }
    next();
});

module.exports = mongoose.model('Wall', wallSchema);
