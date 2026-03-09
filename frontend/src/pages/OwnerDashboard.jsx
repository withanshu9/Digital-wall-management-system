import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../utils/useAuth';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './OwnerDashboard.css';

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
        <div className="animate-fade-in" style={{ paddingBottom: '3rem', overflow: 'hidden' }}>
            <div className="dashboard-header mb-4">
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--accent)' }}>Owner Dashboard</h1>
                    <p className="text-muted" style={{ letterSpacing: '0.025em' }}>Manage inventory, approve bookings, and track earnings.</p>
                </div>
                <button className={`btn ${showForm ? 'btn-outline' : 'btn-primary'}`}
                    style={showForm ? { borderColor: 'var(--danger)', color: 'var(--danger)' } : {}}
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
                <div className="card-concrete listing-form" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'white' }}>{editingWall ? 'Edit Space Specifications' : 'List a New Space'}</h2>
                    <form onSubmit={handleSaveWall} className="form-grid">
                        <div className="form-group mb-1">
                            <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Descriptive Title</label>
                            <input type="text" name="title" className="form-control" style={{ backgroundColor: 'var(--bg-dark)' }} value={formData.title} onChange={handleInputChange} required placeholder="e.g. Bandra LED Screen" />
                        </div>
                        <div className="form-group mb-1">
                            <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Display Format</label>
                            <select name="type" className="form-control" style={{ backgroundColor: 'var(--bg-dark)' }} value={formData.type} onChange={handleInputChange}>
                                <option value="Static Painted Wall">Static Painted Wall</option>
                                <option value="Flex Banner Wall">Flex Banner Wall</option>
                                <option value="LED Video Wall">LED Video Wall</option>
                                <option value="Digital Screen">Digital Screen</option>
                                <option value="Backlit Board">Backlit Board</option>
                                <option value="Glow Sign Board">Glow Sign Board</option>
                            </select>
                        </div>

                        <div className="form-row form-full-width">
                            <div className="form-group mb-1">
                                <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Location Type</label>
                                <select name="locationType" className="form-control" style={{ backgroundColor: 'var(--bg-dark)' }} value={formData.locationType} onChange={handleInputChange}>
                                    <option value="Commercial Area">Commercial Area</option>
                                    <option value="Residential Area">Residential Area</option>
                                    <option value="Highway">Highway</option>
                                    <option value="Market Area">Market Area</option>
                                </select>
                            </div>
                            <div className="form-group mb-1">
                                <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Traffic Level</label>
                                <select name="trafficLevel" className="form-control" style={{ backgroundColor: 'var(--bg-dark)' }} value={formData.trafficLevel} onChange={handleInputChange}>
                                    <option value="High Traffic">High Traffic</option>
                                    <option value="Medium Traffic">Medium Traffic</option>
                                    <option value="Low Traffic">Low Traffic</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group mb-1">
                                <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>City</label>
                                <input type="text" name="city" className="form-control" style={{ backgroundColor: 'var(--bg-dark)' }} value={formData.city} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group mb-1">
                                <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Landmark / Locality</label>
                                <input type="text" name="location" className="form-control" style={{ backgroundColor: 'var(--bg-dark)' }} value={formData.location} onChange={handleInputChange} required />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group mb-1">
                                <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Width (ft)</label>
                                <input type="number" name="width" className="form-control" style={{ backgroundColor: 'var(--bg-dark)' }} value={formData.width} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group mb-1">
                                <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Height (ft)</label>
                                <input type="number" name="height" className="form-control" style={{ backgroundColor: 'var(--bg-dark)' }} value={formData.height} onChange={handleInputChange} required />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group mb-1">
                                <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Pricing Model</label>
                                <select name="pricingType" className="form-control" style={{ backgroundColor: 'var(--bg-dark)' }} value={formData.pricingType} onChange={handleInputChange}>
                                    <option value="monthly">Monthly</option>
                                    <option value="per day">Per Day</option>
                                </select>
                            </div>
                            <div className="form-group mb-1">
                                <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Base Price (₹)</label>
                                <input type="number" name="basePrice" className="form-control" style={{ backgroundColor: 'var(--bg-dark)' }} value={formData.basePrice} onChange={handleInputChange} required />
                            </div>
                        </div>

                        <div className="form-group mb-1 form-full-width">
                            <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Daily Traffic Estimate</label>
                            <input type="number" name="trafficEstimate" className="form-control" style={{ backgroundColor: 'var(--bg-dark)' }} value={formData.trafficEstimate} onChange={handleInputChange} required />
                        </div>

                        <div className="form-row form-full-width" style={{ gap: '1.5rem' }}>
                            <div className="form-group mb-1">
                                <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>High-Res Image URL</label>
                                <input type="url" name="images" className="form-control" style={{ backgroundColor: 'var(--bg-dark)' }} value={formData.images} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
                            </div>
                            <div className="form-group mb-1">
                                <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: 'black', borderRadius: '0.25rem', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', height: '8rem' }}>
                                    {formData.images ? (
                                        <img src={formData.images} alt="Wall Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.25rem', opacity: '0.8' }} onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x200?text=Invalid+Image+URL" }} />
                                    ) : (
                                        <div className="text-muted" style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '0.5rem', opacity: '0.5' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                            Image Preview
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="form-actions form-full-width">
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>{editingWall ? 'Update Listing' : 'Submit Listing'}</button>
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
                    <div className="kpi-grid">
                        <div className="card-concrete kpi-card" style={{ borderLeftColor: 'var(--success)' }}>
                            <div className="kpi-card-header">
                                <div>
                                    <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Net Earnings</h3>
                                    <p style={{ fontSize: '1.875rem', fontWeight: '900', color: 'white', margin: 0 }}>₹{(totalEarnings / 100000).toFixed(1)}L</p>
                                </div>
                                <div className="kpi-icon" style={{ color: 'var(--success)' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div className="card-concrete kpi-card" style={{ borderLeftColor: 'var(--accent)' }}>
                            <div className="kpi-card-header">
                                <div>
                                    <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Overall Occupancy</h3>
                                    <p style={{ fontSize: '1.875rem', fontWeight: '900', color: 'white', margin: 0 }}>{occupancyRate}%</p>
                                </div>
                                <div className="kpi-icon" style={{ color: 'var(--accent)' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                </div>
                            </div>
                            <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', height: '0.375rem', marginTop: '1rem', borderRadius: '9999px', overflow: 'hidden' }}>
                                <div style={{ backgroundColor: 'var(--accent)', height: '100%', width: `${occupancyRate}%`, boxShadow: '0 0 10px var(--accent-glow)' }}></div>
                            </div>
                        </div>

                        <div className="card-concrete kpi-card" style={{ borderLeftColor: 'var(--warning)' }}>
                            <div className="kpi-card-header">
                                <div>
                                    <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Pending Inquiries</h3>
                                    <p style={{ fontSize: '1.875rem', fontWeight: '900', color: 'white', margin: 0 }}>{pendingRequests}</p>
                                </div>
                                <div className="kpi-icon" style={{ color: 'var(--warning)' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CHARTS ROW */}
                    <div className="chart-grid">
                        {/* 1. Bar Chart: Revenue by Wall */}
                        <div className="card-concrete chart-main" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Earnings by Location</h3>
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
                        <div className="card-concrete" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Historical Bookings</h3>
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
                    <div className="content-grid">

                        {/* Booking Requests */}
                        <div className="card-concrete">
                            <div className="card-header">
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Booking Inbox</h2>
                                {pendingRequests > 0 && <span className="badge badge-warning">{pendingRequests} Pending</span>}
                            </div>
                            <div className="list-container">
                                {(bookings || []).map(booking => {
                                    const isPending = booking.bookingStatus === 'pending' || booking.status === 'pending_approval';
                                    return (
                                        <div key={booking._id} className="list-item" style={isPending ? { backgroundColor: 'rgba(245, 158, 11, 0.05)' } : {}}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                                <div>
                                                    <h4 style={{ fontWeight: 'bold', fontSize: '1.125rem', color: 'white', margin: '0 0 0.25rem 0' }}>{booking.wall ? booking.wall.title : 'Deleted Space'}</h4>
                                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Client: <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{booking.advertiser?.name || 'Private Brand'}</span></p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{ fontWeight: '900', fontSize: '1.25rem', color: 'var(--success)' }}>₹{((booking.totalAmount || 0) * 0.9).toLocaleString()}</span>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Net Payout (-10%)</p>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', backgroundColor: 'var(--bg-dark)', padding: '0.5rem 0.75rem', borderRadius: '0.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                                    {new Date(booking.startDate || Date.now()).toLocaleDateString('en-GB')} - {new Date(booking.endDate || Date.now() + 86400000).toLocaleDateString('en-GB')}
                                                </span>
                                            </div>

                                            {isPending ? (
                                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                                    <button className="btn" style={{ flex: 1, backgroundColor: 'var(--success)', color: 'white', padding: '0.5rem', fontSize: '0.875rem' }} onClick={() => handleBookingAction(booking._id, 'confirmed')}>Approve</button>
                                                    <button className="btn btn-outline" style={{ flex: 1, borderColor: 'var(--danger)', color: 'var(--danger)', padding: '0.5rem', fontSize: '0.875rem' }} onClick={() => handleBookingAction(booking._id, 'cancelled')}>Decline</button>
                                                </div>
                                            ) : (
                                                <div style={{ marginTop: '1rem' }}>
                                                    <span className={`status-badge ${['confirmed', 'active', 'completed'].includes(booking.bookingStatus) ? 'status-success' : 'status-default'}`}>
                                                        Status: {booking?.bookingStatus || 'Unknown'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {(!bookings || bookings.length === 0) && (
                                    <div style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: '0.5' }}>
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                        <span>Inbox Zero. No requests right now.</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Inventory Management */}
                        <div className="card-concrete">
                            <div className="card-header">
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>My Spaces</h2>
                                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{activeWallsCount} Active</span>
                            </div>
                            <div className="list-container">
                                {(walls || []).map(wall => (
                                    <div key={wall._id} className="list-item" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div className="space-image-container">
                                            <img src={wall.images?.[0] || 'https://images.unsplash.com/photo-1542204637-e67bc7d41e48?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'} alt="wall" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x200?text=No+Image" }} />
                                        </div>
                                        <div style={{ flexGrow: 1 }}>
                                            <h4 style={{ fontWeight: 'bold', color: 'white', margin: '0 0 0.25rem 0', lineHeight: 1.2 }}>{wall.title}</h4>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>₹{wall?.basePrice?.toLocaleString()}</span>
                                                <span>•</span>
                                                <span style={{ fontWeight: 'bold', color: wall.status === 'approved' ? 'var(--success)' : 'var(--warning)' }}>{wall?.status?.replace('_', ' ').toUpperCase() || 'APPROVED'}</span>
                                                <span>•</span>
                                                <span style={{ color: wall.availability === 'available' ? 'var(--success)' : 'var(--danger)' }}>{wall?.availability?.toUpperCase() || 'AVAILABLE'}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', minWidth: '160px', justifyContent: 'flex-end' }}>
                                            <button className="btn btn-outline" style={{ flex: 1, padding: '0.4rem', fontSize: '0.875rem' }} onClick={() => handleEditClick(wall)}>Edit</button>
                                            <button className="btn" style={{ flex: 1, padding: '0.4rem', fontSize: '0.875rem', border: '1px solid var(--danger)', color: 'var(--danger)', backgroundColor: 'transparent' }} onClick={() => handleRemoveWall(wall._id)}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                                {(!walls || walls.length === 0) && (
                                    <div style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: '0.5' }}>
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
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
