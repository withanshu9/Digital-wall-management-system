import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../utils/useAuth';

const WallDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [wall, setWall] = useState(null);
    const [loading, setLoading] = useState(true);

    // Booking state
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [promoCode, setPromoCode] = useState('');

    // Custom dummy data for demo
    const DUMMY_WALLS = [
        {
            _id: '1', title: 'Times Square Style Billboard', type: 'Outdoor LED Video Wall',
            city: 'Mumbai', location: 'Bandra West Highway', width: 40, height: 20, area: 800,
            pricingType: 'per day', basePrice: 25000, trafficEstimate: 150000, owner: { name: 'AdTech India' },
            images: ['https://images.unsplash.com/photo-1596489392276-88af700947ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
        },
        {
            _id: '2', title: 'Connaught Place Premium Hoarding', type: 'Premium Metro Wallscape',
            city: 'Delhi', location: 'CP Inner Circle', width: 30, height: 15, area: 450,
            pricingType: 'monthly', basePrice: 450000, trafficEstimate: 85000, owner: { name: 'Capital Media Ads' },
            images: ['https://images.unsplash.com/photo-1542204637-e67bc7d41e48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
        }
    ];

    useEffect(() => {
        const fetchWall = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/walls/${id}`);
                setWall({ ...res.data, area: res.data.width * res.data.height });
            } catch (err) {
                // Fallback to dummy
                const found = DUMMY_WALLS.find(w => w._id === id) || DUMMY_WALLS[0];
                setWall(found);
            } finally {
                setLoading(false);
            }
        };
        fetchWall();
    }, [id]);

    // Derived state for calculation
    const getDaysDiff = () => {
        if (!startDate || !endDate) return 0;
        const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getUnits = () => {
        const days = getDaysDiff();
        if (wall?.pricingType === 'monthly') return Math.max(1, Math.ceil(days / 30));
        if (wall?.pricingType === 'per day') return Math.max(1, days);
        return wall?.area || 1; // per sq ft
    };

    const calcPricing = () => {
        if (!wall) return null;
        const units = getUnits();
        const days = getDaysDiff() || 1; // At least 1 day for impression calc

        let baseCost = wall.basePrice * units;

        // Seasonal increase (Mocking a 10% increase for peak season)
        const seasonalIncrease = baseCost * 0.10;
        const permitFees = 5000;
        const installationFees = 15000;

        const subtotal = baseCost + seasonalIncrease + permitFees + installationFees;
        const gst = subtotal * 0.18;
        const totalAmount = subtotal + gst;

        // CPM Calculation
        const totalImpressions = wall.trafficEstimate * days;
        const cpm = totalImpressions > 0 ? (baseCost / totalImpressions) * 1000 : 0;

        return { baseCost, seasonalIncrease, permitFees, installationFees, subtotal, gst, totalAmount, totalImpressions, cpm, units, days };
    };

    const pricing = wall ? calcPricing() : null;

    const handleBook = async () => {
        if (!token) {
            navigate('/login');
            return;
        }

        if (user.role !== 'advertiser') {
            alert("Only advertisers can book walls.");
            return;
        }

        if (!startDate || !endDate) {
            alert("Please select dates");
            return;
        }

        try {
            // 1. Create Booking (Simulated for frontend if API fails)
            let orderOptions = { razorpayOrderId: "dummy_rpay_" + Date.now(), amount: pricing.totalAmount, keyId: "rzp_test_dummykey" };
            let bookingId = "dummy_bkg_" + Date.now();

            try {
                const res = await axios.post('http://localhost:5000/api/bookings/create', {
                    wallId: wall._id,
                    startDate, endDate, units: pricing.units
                }, { headers: { Authorization: `Bearer ${token}` } });

                orderOptions = res.data;
                bookingId = res.data.booking._id;
            } catch (e) {
                console.warn("API Create booking failed, simulating razorpay popup for demo");
            }

            // 2. Open Razorpay (Simulated interface since we don't load external script perfectly in this context, just a manual verification form)
            // *Normally we load https://checkout.razorpay.com/v1/checkout.js here*

            const isConfirmed = window.confirm(`Proceed to Razorpay Checkout for ₹${pricing.totalAmount.toLocaleString()}?`);

            if (isConfirmed) {
                try {
                    await axios.post('http://localhost:5000/api/bookings/verify-payment', {
                        razorpay_order_id: orderOptions.razorpayOrderId,
                        razorpay_payment_id: "pay_" + Date.now(),
                        razorpay_signature: "dummy_sig",
                        bookingId
                    }, { headers: { Authorization: `Bearer ${token}` } });

                    alert("Payment successful! Waiting for Wall Owner approval.");
                    navigate('/dashboard/advertiser');
                } catch (e) {
                    alert("Payment simulated successfully! Note: API verification failed/skipped.");
                    navigate('/dashboard/advertiser');
                }
            }

        } catch (err) {
            alert("Booking error: " + err.message);
        }
    };

    if (loading) return <div className="text-center mt-10 p-10"><div className="spinner"></div>Loading wall details...</div>;
    if (!wall) return <div className="text-center mt-10 p-10 bg-danger text-white rounded">Wall not found</div>;

    return (
        <div className="animate-fade-in pb-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.2rem' }}>{wall.title}</h1>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>📍 {wall.city}, {wall.location}</p>
                </div>
                <div className="text-right">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase" style={{ letterSpacing: '1px' }}>
                        {wall.type}
                    </span>
                    <p className="mt-2 text-sm text-muted">Owned by: <span className="text-white">{wall.owner?.name || 'Unknown'}</span></p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Left Column - Image & Details */}
                <div className="lg:col-span-2">
                    {/* Main Hero Image */}
                    <div className="card-concrete mb-6 billboard-glow" style={{ padding: '0.5rem', border: '5px solid #2a2e35' }}>
                        <img
                            src={wall.images?.[0]}
                            alt={wall.title}
                            style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                    </div>

                    {/* Wall Specs */}
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div className="card-concrete p-4 text-center">
                            <span className="text-sm text-muted block mb-1">Dimensions</span>
                            <span className="text-xl font-bold">{wall.width}×{wall.height} ft</span>
                        </div>
                        <div className="card-concrete p-4 text-center">
                            <span className="text-sm text-muted block mb-1">Total Area</span>
                            <span className="text-xl font-bold">{wall.area} sq ft</span>
                        </div>
                        <div className="card-concrete p-4 text-center">
                            <span className="text-sm text-muted block mb-1">Daily Traffic Estimate</span>
                            <span className="text-xl font-bold text-accent">{(wall.trafficEstimate || 0).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="card-concrete p-6 mb-6">
                        <h3 className="mb-3 border-b border-gray-800 pb-2">Description</h3>
                        <p className="text-muted text-sm" style={{ lineHeight: '1.8' }}>
                            Premium advertising space located at {wall.location}, {wall.city}. Ideal for brands targeting middle to high-income demographics. High visibility during peak hours with an estimated {wall.trafficEstimate} daily vehicular and pedestrian traffic.
                        </p>
                        {wall.link && (
                            <div className="mt-4 pt-4 border-t border-gray-800">
                                <span className="text-sm text-muted block mb-1">External Link/Website</span>
                                <a href={wall.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-1">
                                    🔗 {wall.link}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Booking & Calculator */}
                <div>
                    <div className="card-concrete p-6" style={{ position: 'sticky', top: '100px' }}>
                        <h3 className="mb-4 text-gradient border-b border-gray-800 pb-2">Campaign Booking</h3>

                        {wall.availability === 'booked' ? (
                            <div className="text-center p-6 bg-warning text-dark rounded mb-4 font-bold animate-fade-in shadow-md">
                                <span className="block text-2xl mb-2">🚫</span>
                                Already Booked!
                                <span className="block text-sm font-normal mt-1 opacity-80">This wall is currently occupied. Please checkout other walls.</span>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                                    <div className="form-group mb-0">
                                        <label className="text-xs text-muted block mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                                            value={startDate}
                                            onChange={e => setStartDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div className="form-group mb-0">
                                        <label className="text-xs text-muted block mb-1">End Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                                            value={endDate}
                                            onChange={e => setEndDate(e.target.value)}
                                            min={startDate || new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>

                                {/* Real-time Pricing Calculator */}
                                <div className="bg-dark p-4 rounded mb-4" style={{ backgroundColor: '#13151a', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm">Base Rate</span>
                                        <span className="font-bold">₹{wall.basePrice.toLocaleString()} <span className="text-xs text-muted font-normal">/ {wall.pricingType.replace('per ', '')}</span></span>
                                    </div>

                                    {startDate && endDate && pricing && pricing.days > 0 ? (
                                        <div className="animate-fade-in text-sm" style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-muted">Rate × {pricing.units} {pricing.units === 1 ? 'unit' : 'units'}</span>
                                                <span>₹{pricing.baseCost.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-muted text-warning">Seasonal Peak (10%)</span>
                                                <span className="text-warning">+ ₹{pricing.seasonalIncrease.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-muted">Permit Fees</span>
                                                <span>+ ₹{pricing.permitFees.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between mb-3">
                                                <span className="text-muted">Installation & Prod.</span>
                                                <span>+ ₹{pricing.installationFees.toLocaleString()}</span>
                                            </div>

                                            <div className="flex justify-between mb-1 pt-2 border-t border-gray-800">
                                                <span className="text-muted">Subtotal</span>
                                                <span>₹{pricing.subtotal.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between mb-3 text-muted">
                                                <span>GST (18%)</span>
                                                <span>+ ₹{pricing.gst.toLocaleString()}</span>
                                            </div>

                                            <div className="flex justify-between items-center bg-primary p-3 rounded text-white neon-shadow mt-4" style={{ margin: '0 -10px', boxShadow: 'var(--shadow-neon)' }}>
                                                <span className="font-bold">Total Amount</span>
                                                <span className="text-xl font-black">₹{pricing.totalAmount.toLocaleString()}</span>
                                            </div>

                                            {/* CPM Analytics Widget inside calculator */}
                                            <div className="mt-4 p-3 bg-concrete rounded border border-gray-700 text-center" style={{ backgroundColor: '#1a1d24' }}>
                                                <h4 className="text-xs text-muted mb-2 uppercase tracking-wide">Campaign Analytics</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    <div>
                                                        <span className="block font-bold text-accent" style={{ fontSize: '1.1rem' }}>{pricing.totalImpressions.toLocaleString()}</span>
                                                        <span className="text-xs text-muted">Est. Impressions</span>
                                                    </div>
                                                    <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                                                        <span className="block font-bold" style={{ fontSize: '1.1rem' }}>₹{pricing.cpm.toFixed(2)}</span>
                                                        <span className="text-xs text-muted">CPM</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center p-4 text-muted text-sm" style={{ borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                                            Select start and end dates to calculate exact quote & impressions.
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <button
                            className="btn btn-primary w-full"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', opacity: wall.availability === 'booked' ? 0.5 : 1 }}
                            onClick={handleBook}
                            disabled={!startDate || !endDate || wall.availability === 'booked'}
                        >
                            {wall.availability === 'booked' ? 'Currently Unavailable' : (user?.role === 'owner' || user?.role === 'admin' ? "Login as Advertiser to Book" : "Proceed to Payment")}
                        </button>
                        <div className="text-center mt-3 text-xs text-muted flex items-center justify-center gap-2">
                            <span>💳 Total includes 18% GST + Razorpay Fees automatically</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WallDetail;
