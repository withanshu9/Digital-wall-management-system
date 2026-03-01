import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../utils/useAuth';

const OwnerDashboard = () => {
    const { user, token } = useAuth();
    const [walls, setWalls] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // New wall form state
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', type: 'Static Painted Wall', locationType: 'Commercial Area', trafficLevel: 'High Traffic', city: '', location: '',
        width: '', height: '', pricingType: 'monthly', basePrice: '', trafficEstimate: '', link: '', images: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [wallsRes, bookingsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/walls/owner/me', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/bookings/owner/me', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setWalls(wallsRes.data);
                setBookings(bookingsRes.data);
            } catch (err) {
                // Mock fallback for UI testing
                setWalls([
                    { _id: 'w1', title: 'Pune Highway Static Wall', status: 'approved', availability: 'booked', basePrice: 320000, pricingType: 'monthly' },
                    { _id: 'w2', title: 'Mumbai Local Train Wrap', status: 'pending_approval', availability: 'available', basePrice: 150000, pricingType: 'monthly' }
                ]);
                setBookings([
                    { _id: 'b1', advertiser: { name: 'Coca Cola India' }, wall: { title: 'Pune Highway Static Wall' }, startDate: '2026-05-01', endDate: '2026-08-01', totalAmount: 1100000, commission: 110000, status: 'pending_approval' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchData();
    }, [token]);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddWall = async (e) => {
        e.preventDefault();
        try {
            // Mocking API call success
            const newWall = { ...formData, _id: 'temp_' + Date.now(), status: 'pending_approval', availability: 'available' };

            // Convert images string to array if needed, but the backend will handle it
            const payload = {
                ...formData,
                images: formData.images ? [formData.images] : []
            };

            try {
                const res = await axios.post('http://localhost:5000/api/walls', payload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setWalls([...walls, res.data]);
            } catch (apiErr) {
                setWalls([...walls, newWall]);
                console.warn("API Add wall failed, using local state update for demo");
            }

            setShowForm(false);
            alert("Wall submitted for Admin approval!");
        } catch (err) {
            alert("Error adding wall");
        }
    };

    const handleRemoveWall = async (id) => {
        if (!window.confirm("Are you sure you want to delete this wall? This action cannot be undone.")) return;
        try {
            await axios.delete(`http://localhost:5000/api/walls/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setWalls(walls.filter(w => w._id !== id));
        } catch (e) {
            setWalls(walls.filter(w => w._id !== id));
            console.warn('API delete error, removed locally for demo.');
        }
    };

    const handleBookingAction = async (bookingId, status) => {
        try {
            await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            setBookings(bookings.map(b => b._id === bookingId ? { ...b, status } : b));
        } catch (err) {
            // Fallback demo update
            setBookings(bookings.map(b => b._id === bookingId ? { ...b, status } : b));
            alert(`Booking ${status} (Demo Mode)`);
        }
    };

    const totalEarnings = bookings.filter(b => b.status === 'approved' || b.status === 'completed')
        .reduce((sum, b) => sum + (b.totalAmount - b.commission), 0);

    const pendingRequests = bookings.filter(b => b.status === 'pending_approval').length;

    return (
        <div className="animate-fade-in pb-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl mb-2">Owner Dashboard</h1>
                    <p className="text-muted">Manage inventory and booking requests.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Add New Wall'}
                </button>
            </div>

            {showForm && (
                <div className="card-concrete p-6 mb-8 border border-accent">
                    <h2 className="mb-4 text-accent">List a new Wall Space</h2>
                    <form onSubmit={handleAddWall} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group mb-0">
                            <label className="form-label">Title</label>
                            <input type="text" name="title" className="form-control" onChange={handleInputChange} required placeholder="e.g. Bandra LED Screen" />
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label">Display Format</label>
                            <select name="type" className="form-control" onChange={handleInputChange}>
                                <option value="Static Painted Wall">Static Painted Wall</option>
                                <option value="Flex Banner Wall">Flex Banner Wall</option>
                                <option value="LED Video Wall">LED Video Wall</option>
                                <option value="Digital Screen">Digital Screen</option>
                                <option value="Backlit Board">Backlit Board</option>
                                <option value="Glow Sign Board">Glow Sign Board</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:col-span-2">
                            <div className="form-group mb-0">
                                <label className="form-label">Location Type</label>
                                <select name="locationType" className="form-control" onChange={handleInputChange}>
                                    <option value="Commercial Area">Commercial Area</option>
                                    <option value="Residential Area">Residential Area</option>
                                    <option value="Highway">Highway</option>
                                    <option value="Market Area">Market Area</option>
                                    <option value="Near Mall">Near Mall</option>
                                    <option value="Near College/School">Near College/School</option>
                                    <option value="Near Hospital">Near Hospital</option>
                                    <option value="Metro/Bus Stand">Metro/Bus Stand</option>
                                    <option value="Industrial Area">Industrial Area</option>
                                </select>
                            </div>
                            <div className="form-group mb-0">
                                <label className="form-label">Traffic Level</label>
                                <select name="trafficLevel" className="form-control" onChange={handleInputChange}>
                                    <option value="High Traffic">High Traffic</option>
                                    <option value="Medium Traffic">Medium Traffic</option>
                                    <option value="Low Traffic">Low Traffic</option>
                                    <option value="24/7 Visibility">24/7 Visibility</option>
                                    <option value="Peak Hour Visibility">Peak Hour Visibility</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="form-group mb-0">
                                <label className="form-label">City</label>
                                <input type="text" name="city" className="form-control" onChange={handleInputChange} required />
                            </div>
                            <div className="form-group mb-0">
                                <label className="form-label">Location/Landmark</label>
                                <input type="text" name="location" className="form-control" onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="form-group mb-0">
                                <label className="form-label">Width (ft)</label>
                                <input type="number" name="width" className="form-control" onChange={handleInputChange} required />
                            </div>
                            <div className="form-group mb-0">
                                <label className="form-label">Height (ft)</label>
                                <input type="number" name="height" className="form-control" onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="form-group mb-0">
                                <label className="form-label">Pricing Type</label>
                                <select name="pricingType" className="form-control" onChange={handleInputChange}>
                                    <option value="monthly">Monthly</option>
                                    <option value="per day">Per Day</option>
                                    <option value="per sq ft">Per Sq Ft</option>
                                </select>
                            </div>
                            <div className="form-group mb-0">
                                <label className="form-label">Base Price (₹)</label>
                                <input type="number" name="basePrice" className="form-control" onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="form-group mb-0 md:col-span-2">
                            <label className="form-label">Daily Traffic Estimate</label>
                            <input type="number" name="trafficEstimate" className="form-control" onChange={handleInputChange} required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:col-span-2">
                            <div className="form-group mb-0">
                                <label className="form-label">External Link/Website (Optional)</label>
                                <input type="url" name="link" className="form-control" onChange={handleInputChange} placeholder="https://example.com" />
                            </div>
                            <div className="form-group mb-0">
                                <label className="form-label">Image URL</label>
                                <input type="url" name="images" className="form-control" onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
                            </div>
                        </div>
                        <div className="md:col-span-2 mt-4">
                            <button type="submit" className="btn btn-primary w-full">Submit for Approval</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card-concrete p-6 border-l-4" style={{ borderLeftColor: 'var(--success)' }}>
                    <h3 className="text-sm text-muted uppercase tracking-wider mb-2">Net Earnings</h3>
                    <p className="text-3xl font-bold text-success">₹{totalEarnings.toLocaleString()}</p>
                    <p className="text-xs text-muted mt-2">After 10% platform commission</p>
                </div>
                <div className="card-concrete p-6 border-l-4" style={{ borderLeftColor: 'var(--warning)' }}>
                    <h3 className="text-sm text-muted uppercase tracking-wider mb-2">Pending Requests</h3>
                    <p className="text-3xl font-bold">{pendingRequests}</p>
                </div>
                <div className="card-concrete p-6 border-l-4" style={{ borderLeftColor: 'var(--primary)' }}>
                    <h3 className="text-sm text-muted uppercase tracking-wider mb-2">Active Walls</h3>
                    <p className="text-3xl font-bold">{walls.filter(w => w.status === 'approved').length} <span className="text-lg text-muted font-normal">/ {walls.length} total</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inventory */}
                <div className="card-concrete">
                    <div className="p-4 border-b border-gray-800">
                        <h2 className="text-xl">Your Inventory</h2>
                    </div>
                    <div className="p-0">
                        {walls.map(wall => (
                            <div key={wall._id} className="p-4 border-b border-gray-800 flex justify-between items-center hover:bg-gray-900" style={{ transition: 'background 0.2s' }}>
                                <div>
                                    <h4 className="font-bold">{wall.title}</h4>
                                    <div className="text-xs text-muted mt-1 flex gap-2">
                                        <span>₹{wall.basePrice.toLocaleString()} / {wall.pricingType.replace('per ', '')}</span>
                                        <span>•</span>
                                        <span className={wall.status === 'approved' ? 'text-success' : 'text-warning'}>
                                            {wall.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <span className={`text-xs px-2 py-1 rounded font-bold ${wall.availability === 'available' ? 'bg-success text-dark' : 'bg-warning text-dark'}`}>
                                        {wall.availability.toUpperCase()}
                                    </span>
                                    <button
                                        className="text-xs text-danger hover:underline hover:text-white"
                                        onClick={() => handleRemoveWall(wall._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                        {walls.length === 0 && <div className="p-6 text-center text-muted">No walls added yet.</div>}
                    </div>
                </div>

                {/* Requests */}
                <div className="card-concrete">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="text-xl">Booking Requests</h2>
                        {pendingRequests > 0 && <span className="bg-warning text-dark px-2 rounded-full text-xs font-bold">{pendingRequests} New</span>}
                    </div>
                    <div className="p-0">
                        {bookings.map(booking => (
                            <div key={booking._id} className="p-4 border-b border-gray-800 relative" style={{ backgroundColor: booking.status === 'pending_approval' ? 'rgba(255, 179, 0, 0.05)' : 'transparent' }}>
                                <div className="flex justify-between mb-2">
                                    <h4 className="font-bold text-accent">{booking.wall ? booking.wall.title : 'Deleted Wall'}</h4>
                                    <span className="font-bold text-lg text-success">₹{(booking.totalAmount - booking.commission).toLocaleString()}</span>
                                </div>
                                <p className="text-sm mb-1 text-muted">Advertiser: <span className="text-white">{booking.advertiser?.name || 'Local Brand'}</span></p>
                                <p className="text-xs text-muted mb-3">
                                    Dates: {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}
                                </p>

                                {booking.status === 'pending_approval' ? (
                                    <div className="flex gap-2">
                                        <button className="btn btn-primary bg-success hover:bg-green-600 text-white" style={{ padding: '0.3rem 1rem', fontSize: '0.8rem' }} onClick={() => handleBookingAction(booking._id, 'approved')}>Accept</button>
                                        <button className="btn btn-outline text-danger border-danger" style={{ padding: '0.3rem 1rem', fontSize: '0.8rem' }} onClick={() => handleBookingAction(booking._id, 'rejected')}>Reject</button>
                                    </div>
                                ) : (
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${booking.status === 'approved' ? 'bg-success text-dark' : 'bg-gray-600'}`}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                )}

                                {booking.status === 'approved' && (
                                    <div className="mt-2 text-xs text-muted pt-2 border-t border-gray-800">
                                        * 10% platform commission (₹{booking.commission.toLocaleString()}) deducted automatically.
                                    </div>
                                )}
                            </div>
                        ))}
                        {bookings.length === 0 && <div className="p-6 text-center text-muted">No booking requests yet.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
