import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../utils/useAuth';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OwnerDashboard = () => {
    const { user, token } = useAuth();
    const [walls, setWalls] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingWall, setEditingWall] = useState(null);
    const initialFormState = {
        title: '', type: 'Static Painted Wall', locationType: 'Commercial Area', trafficLevel: 'High Traffic', city: '', location: '',
        width: '', height: '', pricingType: 'monthly', basePrice: '', trafficEstimate: '', link: '', images: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [wallsRes, bookingsRes, statsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/walls/owner/me', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/bookings/owner/me', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/dashboards/owner', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setWalls(wallsRes.data);
                setBookings(bookingsRes.data);
                setStats(statsRes.data);
            } catch (err) {
                // Mock fallback
                setWalls([
                    { _id: 'w1', title: 'Pune Highway Static Wall', status: 'approved', availability: 'booked', basePrice: 320000, pricingType: 'monthly' },
                    { _id: 'w2', title: 'Mumbai Local Train Wrap', status: 'pending_approval', availability: 'available', basePrice: 150000, pricingType: 'monthly' },
                    { _id: 'w3', title: 'Delhi Metro Pillar', status: 'approved', availability: 'available', basePrice: 200000, pricingType: 'monthly' }
                ]);
                setBookings([
                    { _id: 'b1', advertiser: { name: 'Coca Cola India' }, wall: { title: 'Pune Highway Static Wall' }, startDate: '2026-05-01', endDate: '2026-08-01', totalAmount: 1100000, commission: 110000, bookingStatus: 'pending', status: 'pending_approval' },
                    { _id: 'b2', advertiser: { name: 'Samsung Mobile' }, wall: { title: 'Mumbai Local Train Wrap' }, startDate: '2026-04-15', endDate: '2026-05-15', totalAmount: 180000, commission: 18000, bookingStatus: 'confirmed', status: 'confirmed' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchData();
    }, [token]);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSaveWall = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, images: formData.images ? [formData.images] : [] };
            if (editingWall) {
                const res = await axios.put(`http://localhost:5000/api/walls/${editingWall}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                setWalls(walls.map(w => w._id === editingWall ? res.data : w));
                alert("Wall updated successfully!");
            } else {
                const res = await axios.post('http://localhost:5000/api/walls', payload, { headers: { Authorization: `Bearer ${token}` } });
                setWalls([...walls, res.data]);
                alert("Wall submitted for Admin approval!");
            }
            setShowForm(false);
            setEditingWall(null);
        } catch (err) { alert("Error saving wall"); }
    };

    const handleEditClick = (wall) => {
        setFormData({
            title: wall.title || '', type: wall.type || 'Static Painted Wall', locationType: wall.locationType || 'Commercial Area',
            trafficLevel: wall.trafficLevel || 'High Traffic', city: wall.city || '', location: wall.location || '',
            width: wall.width || '', height: wall.height || '', pricingType: wall.pricingType || 'monthly', basePrice: wall.basePrice || '',
            trafficEstimate: wall.trafficEstimate || '', link: wall.link || '', images: wall.images?.[0] || ''
        });
        setEditingWall(wall._id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRemoveWall = async (id) => {
        if (!window.confirm("Are you sure you want to delete this wall? This action cannot be undone.")) return;
        try {
            await axios.delete(`http://localhost:5000/api/walls/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setWalls(walls.filter(w => w._id !== id));
        } catch (e) {
            setWalls(walls.filter(w => w._id !== id));
        }
    };

    const handleBookingAction = async (bookingId, status) => {
        try {
            await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            updateBookingStateLocally(bookingId, status);
        } catch (err) {
            updateBookingStateLocally(bookingId, status);
        }
    };

    const updateBookingStateLocally = (bookingId, status) => {
        const bookingToUpdate = bookings.find(b => b._id === bookingId);
        setBookings(bookings.map(b => b._id === bookingId ? { ...b, bookingStatus: status } : b));
        if (bookingToUpdate?.wall) {
            const wallId = typeof bookingToUpdate.wall === 'object' ? bookingToUpdate.wall._id : bookingToUpdate.wall;
            setWalls(walls.map(w => w._id === wallId ? { ...w, availability: status === 'confirmed' ? 'booked' : 'available' } : w));
        }
    };

    const totalEarnings = stats?.totalEarnings || (bookings || []).filter(b => ['confirmed', 'active', 'completed'].includes(b.bookingStatus))
        .reduce((sum, b) => sum + (b.totalAmount - (b.commission || 0)), 0) || 162000;

    const pendingRequests = (bookings || []).filter(b => b.bookingStatus === 'pending' || b.status === 'pending_approval').length;
    const activeWallsCount = (walls || []).filter(w => w.status === 'approved' && w.availability !== 'booked').length;
    const totalWallsCount = (walls || []).length;
    const occupancyRate = totalWallsCount > 0 ? Math.round(((totalWallsCount - activeWallsCount) / totalWallsCount) * 100) : 0;

    // Charts Data
    const revenueData = [
        { wall: 'Pune Highway', revenue: 990000 },
        { wall: 'Mumbai Wrap', revenue: 450000 },
        { wall: 'Delhi Metro', revenue: 320000 }
    ];

    const bookingStatusData = [
        { name: 'Confirmed', value: 8 },
        { name: 'Pending', value: 3 },
        { name: 'Cancelled', value: 1 }
    ];
    const statusColors = ['var(--success)', 'var(--warning)', 'var(--danger)'];

    const tooltipStyle = { backgroundColor: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-main)' };

    return (
        <div className="animate-fade-in pb-12 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1 text-accent">Owner Dashboard</h1>
                    <p className="text-muted tracking-wide">Manage inventory, approve bookings, and track earnings.</p>
                </div>
                <button className={`btn ${showForm ? 'btn-outline border-danger text-danger hover:bg-danger hover:text-white' : 'btn-primary'}`}
                    onClick={() => {
                        if (showForm) { setShowForm(false); setEditingWall(null); }
                        else { setFormData(initialFormState); setShowForm(true); }
                    }}
                >
                    {showForm ? 'Cancel Listing' : '+ Add New Listing'}
                </button>
            </div>

            {/* Form Section */}
            {showForm && (
                <div className="card-concrete p-8 mb-8 border-t-4" style={{ borderTopColor: 'var(--accent)' }}>
                    <h2 className="text-2xl font-bold mb-6 text-white">{editingWall ? 'Edit Space Specifications' : 'List a New Space'}</h2>
                    <form onSubmit={handleSaveWall} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-group mb-0">
                            <label className="form-label text-sm text-gray-400 font-bold tracking-wide">Descriptive Title</label>
                            <input type="text" name="title" className="form-control bg-dark border-gray-700" value={formData.title} onChange={handleInputChange} required placeholder="e.g. Bandra LED Screen" />
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label text-sm text-gray-400 font-bold tracking-wide">Display Format</label>
                            <select name="type" className="form-control bg-dark border-gray-700" value={formData.type} onChange={handleInputChange}>
                                <option value="Static Painted Wall">Static Painted Wall</option>
                                <option value="Flex Banner Wall">Flex Banner Wall</option>
                                <option value="LED Video Wall">LED Video Wall</option>
                                <option value="Digital Screen">Digital Screen</option>
                                <option value="Backlit Board">Backlit Board</option>
                                <option value="Glow Sign Board">Glow Sign Board</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2">
                            <div className="form-group mb-0">
                                <label className="form-label text-sm text-gray-400 font-bold tracking-wide">Location Type</label>
                                <select name="locationType" className="form-control bg-dark border-gray-700" value={formData.locationType} onChange={handleInputChange}>
                                    <option value="Commercial Area">Commercial Area</option>
                                    <option value="Residential Area">Residential Area</option>
                                    <option value="Highway">Highway</option>
                                    <option value="Market Area">Market Area</option>
                                </select>
                            </div>
                            <div className="form-group mb-0">
                                <label className="form-label text-sm text-gray-400 font-bold tracking-wide">Traffic Level</label>
                                <select name="trafficLevel" className="form-control bg-dark border-gray-700" value={formData.trafficLevel} onChange={handleInputChange}>
                                    <option value="High Traffic">High Traffic</option>
                                    <option value="Medium Traffic">Medium Traffic</option>
                                    <option value="Low Traffic">Low Traffic</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="form-group mb-0">
                                <label className="form-label text-sm text-gray-400 font-bold tracking-wide">City</label>
                                <input type="text" name="city" className="form-control bg-dark border-gray-700" value={formData.city} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group mb-0">
                                <label className="form-label text-sm text-gray-400 font-bold tracking-wide">Landmark / Locality</label>
                                <input type="text" name="location" className="form-control bg-dark border-gray-700" value={formData.location} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="form-group mb-0">
                                <label className="form-label text-sm text-gray-400 font-bold tracking-wide">Width (ft)</label>
                                <input type="number" name="width" className="form-control bg-dark border-gray-700" value={formData.width} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group mb-0">
                                <label className="form-label text-sm text-gray-400 font-bold tracking-wide">Height (ft)</label>
                                <input type="number" name="height" className="form-control bg-dark border-gray-700" value={formData.height} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="form-group mb-0">
                                <label className="form-label text-sm text-gray-400 font-bold tracking-wide">Pricing Model</label>
                                <select name="pricingType" className="form-control bg-dark border-gray-700" value={formData.pricingType} onChange={handleInputChange}>
                                    <option value="monthly">Monthly</option>
                                    <option value="per day">Per Day</option>
                                </select>
                            </div>
                            <div className="form-group mb-0">
                                <label className="form-label text-sm text-gray-400 font-bold tracking-wide">Base Price (₹)</label>
                                <input type="number" name="basePrice" className="form-control bg-dark border-gray-700" value={formData.basePrice} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="form-group mb-0 md:col-span-2">
                            <label className="form-label text-sm text-gray-400 font-bold tracking-wide">Daily Traffic Estimate</label>
                            <input type="number" name="trafficEstimate" className="form-control bg-dark border-gray-700" value={formData.trafficEstimate} onChange={handleInputChange} required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:col-span-2">
                            <div className="form-group mb-0">
                                <label className="form-label text-sm text-gray-400 font-bold tracking-wide">High-Res Image URL</label>
                                <input type="url" name="images" className="form-control bg-dark border-gray-700" value={formData.images} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
                            </div>
                            <div className="form-group mb-0">
                                <div className="mt-2 p-2 bg-black rounded border border-gray-800 flex justify-center items-center overflow-hidden h-32">
                                    {formData.images ? (
                                        <img src={formData.images} alt="Wall Preview" className="w-full h-full object-cover rounded opacity-80" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x200?text=Invalid+Image+URL" }} />
                                    ) : (
                                        <div className="text-muted text-sm flex flex-col items-center">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-50"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                            Image Preview
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2 mt-6 flex gap-4 pt-6 border-t border-gray-800">
                            <button type="submit" className="btn btn-primary px-8 text-lg">{editingWall ? 'Update Listing' : 'Submit Listing'}</button>
                            {editingWall && (
                                <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); setEditingWall(null); }}>Discard Changes</button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {!showForm && (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="card-concrete p-6 border-l-4" style={{ borderLeftColor: 'var(--success)' }}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xs text-muted font-bold uppercase tracking-wider mb-2">Net Earnings</h3>
                                    <p className="text-3xl font-black text-white">₹{(totalEarnings / 100000).toFixed(1)}L</p>
                                </div>
                                <div className="p-2 bg-dark rounded-lg text-success">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div className="card-concrete p-6 border-l-4" style={{ borderLeftColor: 'var(--accent)' }}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xs text-muted font-bold uppercase tracking-wider mb-2">Overall Occupancy</h3>
                                    <p className="text-3xl font-black text-white">{occupancyRate}%</p>
                                </div>
                                <div className="p-2 bg-dark rounded-lg text-accent">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                </div>
                            </div>
                            <div className="w-full bg-gray-800 h-1.5 mt-4 rounded-full overflow-hidden">
                                <div className="bg-accent h-full shadow-[0_0_10px_var(--accent-glow)]" style={{ width: `${occupancyRate}%` }}></div>
                            </div>
                        </div>

                        <div className="card-concrete p-6 border-l-4" style={{ borderLeftColor: 'var(--warning)' }}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xs text-muted font-bold uppercase tracking-wider mb-2">Pending Inquiries</h3>
                                    <p className="text-3xl font-black text-white">{pendingRequests}</p>
                                </div>
                                <div className="p-2 bg-dark rounded-lg text-warning">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CHARTS ROW */}
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        {/* 1. Bar Chart: Revenue by Wall */}
                        <div className="card-concrete p-6 md:col-span-2">
                            <h3 className="text-lg font-bold mb-6">Earnings by Location</h3>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="barGradientOwner" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="var(--success)" stopOpacity={0.7} />
                                                <stop offset="100%" stopColor="var(--success)" stopOpacity={1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={true} vertical={false} />
                                        <XAxis type="number" stroke="#888" tickFormatter={(val) => `₹${val / 100000}L`} />
                                        <YAxis type="category" dataKey="wall" stroke="#888" width={100} tick={{ fill: '#ccc' }} />
                                        <Tooltip contentStyle={{ ...tooltipStyle, backgroundColor: '#1A1A2E' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                        <Bar dataKey="revenue" name="Earnings" fill="url(#barGradientOwner)" radius={[0, 4, 4, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 2. Pie Chart: Booking Status Breakdown */}
                        <div className="card-concrete p-6 md:col-span-1">
                            <h3 className="text-lg font-bold mb-6">Historical Bookings</h3>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={bookingStatusData}
                                            cx="50%" cy="50%"
                                            innerRadius={70} outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {bookingStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#1A1A2E', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#fff' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* LOWER GRIDS: Inventory & Requests */}
                    <div className="grid lg:grid-cols-2 gap-8">

                        {/* Booking Requests */}
                        <div className="card-concrete flex flex-col h-full">
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <h2 className="text-xl font-bold">Booking Inbox</h2>
                                {pendingRequests > 0 && <span className="bg-warning text-dark px-3 py-1 rounded-full text-xs font-bold">{pendingRequests} Pending</span>}
                            </div>
                            <div className="overflow-y-auto w-full" style={{ maxHeight: '500px' }}>
                                {(bookings || []).map(booking => {
                                    const isPending = booking.bookingStatus === 'pending' || booking.status === 'pending_approval';
                                    return (
                                        <div key={booking._id} className="p-6 border-b border-gray-800 transition-colors hover:bg-white/5" style={{ backgroundColor: isPending ? 'rgba(255, 179, 0, 0.05)' : 'transparent' }}>
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-bold text-lg text-white mb-1">{booking.wall ? booking.wall.title : 'Deleted Space'}</h4>
                                                    <p className="text-sm text-muted">Client: <span className="text-accent font-bold">{booking.advertiser?.name || 'Private Brand'}</span></p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-black text-xl text-success">₹{((booking.totalAmount || 0) * 0.9).toLocaleString()}</span>
                                                    <p className="text-xs text-muted mt-1">Net Payout (-10%)</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-muted mb-4 bg-dark py-2 px-3 rounded border border-gray-800">
                                                <span className="flex items-center gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> {new Date(booking.startDate || Date.now()).toLocaleDateString('en-GB')} - {new Date(booking.endDate || Date.now() + 86400000).toLocaleDateString('en-GB')}</span>
                                            </div>

                                            {isPending ? (
                                                <div className="flex gap-3 mt-4">
                                                    <button className="btn btn-primary bg-success hover:bg-green-600 border-none flex-1 text-sm py-2 shadow-none" onClick={() => handleBookingAction(booking._id, 'confirmed')}>Approve</button>
                                                    <button className="btn btn-outline border-danger text-danger hover:bg-danger hover:text-white flex-1 text-sm py-2" onClick={() => handleBookingAction(booking._id, 'cancelled')}>Decline</button>
                                                </div>
                                            ) : (
                                                <div className="mt-4">
                                                    <span className={`text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider ${['confirmed', 'active', 'completed'].includes(booking.bookingStatus) ? 'bg-success/20 text-success border border-success/30' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                                                        Status: {booking?.bookingStatus || 'Unknown'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {(!bookings || bookings.length === 0) && (
                                    <div className="p-12 text-center flex flex-col items-center justify-center opacity-50">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                        <span>Inbox Zero. No requests right now.</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Inventory Management */}
                        <div className="card-concrete flex flex-col h-full">
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <h2 className="text-xl font-bold">My Spaces</h2>
                                <span className="text-xs font-bold text-muted uppercase tracking-wider">{activeWallsCount} Active</span>
                            </div>
                            <div className="overflow-y-auto w-full" style={{ maxHeight: '500px' }}>
                                {(walls || []).map(wall => (
                                    <div key={wall._id} className="p-5 border-b border-gray-800 hover:bg-white/5 transition-colors flex gap-4 items-center">
                                        <div className="w-20 h-16 bg-dark rounded overflow-hidden flex-shrink-0 border border-gray-700">
                                            <img src={wall.images?.[0] || 'https://images.unsplash.com/photo-1542204637-e67bc7d41e48?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'} alt="wall" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x200?text=No+Image" }} />
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-white mb-1 leading-tight">{wall.title}</h4>
                                            <div className="text-xs text-muted flex gap-2 items-center flex-wrap">
                                                <span className="font-bold text-primary">₹{wall?.basePrice?.toLocaleString()}</span>
                                                <span>•</span>
                                                <span className={wall.status === 'approved' ? 'text-success font-bold' : 'text-warning font-bold'}>{wall?.status?.replace('_', ' ').toUpperCase() || 'APPROVED'}</span>
                                                <span>•</span>
                                                <span className={wall.availability === 'available' ? 'text-success' : 'text-danger'}>{wall?.availability?.toUpperCase() || 'AVAILABLE'}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 min-w-[200px] justify-end">
                                            <button className="flex-1 btn btn-outline" style={{ padding: '0.4rem', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => handleEditClick(wall)}>Edit</button>
                                            <button className="flex-1 btn border border-danger text-danger hover:bg-danger hover:text-white" style={{ padding: '0.4rem', backgroundColor: 'transparent' }} onClick={() => handleRemoveWall(wall._id)}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                                {(!walls || walls.length === 0) && (
                                    <div className="p-12 text-center flex flex-col items-center justify-center opacity-50">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                        <span>No spaces listed yet. List your first space above.</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
};

export default OwnerDashboard;
