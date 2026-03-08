import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../utils/useAuth';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
    const { token } = useAuth();
    const [walls, setWalls] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [wallsRes, bookingsRes, statsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/walls/admin/all', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/bookings/admin/all', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/dashboards/admin', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setWalls(wallsRes.data);
                setBookings(bookingsRes.data);
                setStats(statsRes.data);
            } catch (err) {
                // Mock fallback
                setWalls([
                    { _id: 'w1', title: 'Pune Highway Static Wall', status: 'pending_approval', owner: { name: 'Owner A' } },
                    { _id: 'w2', title: 'Mumbai Local Train Wrap', status: 'approved', owner: { name: 'Owner B' } }
                ]);
                setBookings([
                    { _id: 'b1', totalAmount: 1100000, commission: 110000, gst: 167796, status: 'approved' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchData();
    }, [token]);

    const handleApproveWall = async (id, status) => {
        try {
            await axios.patch(`http://localhost:5000/api/walls/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            setWalls(walls.map(w => w._id === id ? { ...w, status } : w));
        } catch (e) {
            setWalls(walls.map(w => w._id === id ? { ...w, status } : w));
        }
    };

    const handleRemoveWall = async (id) => {
        if (!window.confirm("Are you sure you want to completely delete this wall from the system?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/walls/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setWalls(walls.filter(w => w._id !== id));
        } catch (e) {
            setWalls(walls.filter(w => w._id !== id));
        }
    };

    // Financials
    const totalRevenue = stats?.totalRevenue || bookings.filter(b => b.status === 'approved' || b.bookingStatus === 'completed').reduce((sum, b) => sum + b.totalAmount, 0) || 12500000;
    const totalCommission = stats?.totalCommission || bookings.filter(b => b.status === 'approved' || b.bookingStatus === 'completed').reduce((sum, b) => sum + b.commission, 0) || 1250000;
    const pendingWalls = walls.filter(w => w.status === 'pending_approval');

    // MOCK DATA FOR CHARTS 
    // 1. Revenue Over Time
    const revenueData = [
        { month: 'Jan', revenue: 1500000, target: 1200000 },
        { month: 'Feb', revenue: 1800000, target: 1300000 },
        { month: 'Mar', revenue: 1400000, target: 1400000 },
        { month: 'Apr', revenue: 2100000, target: 1500000 },
        { month: 'May', revenue: 2500000, target: 1700000 }, // IPL peak
        { month: 'Jun', revenue: 1900000, target: 1800000 }
    ];

    // 2. Bookings by City (Horizontal)
    const cityData = [
        { city: 'Mumbai', bookings: 120 },
        { city: 'Delhi', bookings: 89 },
        { city: 'Bangalore', bookings: 72 },
        { city: 'Pune', bookings: 45 },
        { city: 'Hyderabad', bookings: 38 }
    ];

    // 3. Ad Format Popularity (Donut)
    const formatData = [
        { name: 'Billboard', value: 45 },
        { name: 'LED Wall', value: 30 },
        { name: 'Transit', value: 15 },
        { name: 'Painted Wall', value: 10 }
    ];
    const formatColors = ['#E85D04', '#FFD60A', '#10B981', '#38BDF8'];

    // 4. New Users Over Time (Area)
    const userData = [
        { month: 'Jan', advertisers: 45, owners: 12 },
        { month: 'Feb', advertisers: 52, owners: 15 },
        { month: 'Mar', advertisers: 61, owners: 18 },
        { month: 'Apr', advertisers: 85, owners: 24 },
        { month: 'May', advertisers: 110, owners: 30 }
    ];

    // 5. Booking Status (Stacked Bar)
    const statusData = [
        { month: 'Feb', confirmed: 140, pending: 20, cancelled: 10 },
        { month: 'Mar', confirmed: 120, pending: 35, cancelled: 15 },
        { month: 'Apr', confirmed: 180, pending: 15, cancelled: 8 },
        { month: 'May', confirmed: 210, pending: 40, cancelled: 12 }
    ];

    // 6. Revenue by Format (Grouped Bar)
    const revFormatData = [
        { month: 'Mar', billboard: 600000, led: 500000, transit: 300000 },
        { month: 'Apr', billboard: 800000, led: 900000, transit: 400000 },
        { month: 'May', billboard: 950000, led: 1100000, transit: 450000 }
    ];

    // Custom Tooltip Styles for Dark Theme
    const tooltipStyle = { backgroundColor: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-main)' };

    return (
        <div className="animate-fade-in pb-12 overflow-hidden">
            <h1 className="text-3xl mb-1 text-primary font-bold">Admin Command Center</h1>
            <p className="text-muted mb-8 tracking-wide">Platform analytics, revenue, and approval queue.</p>

            {/* KPI Cards / Occupancy Gauge Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card-concrete p-6 border-l-4" style={{ borderLeftColor: 'var(--primary)' }}>
                    <h3 className="text-xs text-muted font-bold uppercase tracking-wider mb-2">Total Platform Revenue</h3>
                    <p className="text-3xl font-black">₹{(totalRevenue / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-success mt-2">+14% from last month</p>
                </div>
                <div className="card-concrete p-6 border-l-4" style={{ borderLeftColor: 'var(--success)' }}>
                    <h3 className="text-xs text-muted font-bold uppercase tracking-wider mb-2">Platform Earnings</h3>
                    <p className="text-3xl font-black text-white">₹{(totalCommission / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-success mt-2">10% standard commission</p>
                </div>
                <div className="card-concrete p-6 border-l-4" style={{ borderLeftColor: 'var(--accent)' }}>
                    <h3 className="text-xs text-muted font-bold uppercase tracking-wider mb-2">Active Spaces</h3>
                    <p className="text-3xl font-black">528</p>
                    <p className="text-xs text-muted mt-2">Across 12 cities</p>
                </div>
                <div className="card-concrete p-6 flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <h3 className="text-xs text-muted font-bold uppercase tracking-wider mb-1 z-10">Occupancy Rate</h3>
                    <div className="text-4xl font-black text-accent z-10">67%</div>
                    <div className="w-full bg-gray-800 h-2 mt-3 rounded-full overflow-hidden z-10">
                        <div className="bg-accent h-full shadow-[0_0_10px_var(--accent-glow)]" style={{ width: '67%' }}></div>
                    </div>
                </div>
            </div>

            {/* CHARTS GRID 1: Line & Area */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* 1. Total Revenue Over Time (Line Chart) */}
                <div className="card-concrete p-6">
                    <h3 className="text-lg font-bold mb-6">Total Revenue vs Target</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="month" stroke="#888" />
                                <YAxis stroke="#888" tickFormatter={(val) => `₹${val / 100000}L`} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" name="Actual Revenue" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                <Line type="dashed" dataKey="target" name="Target" stroke="var(--text-muted)" strokeWidth={2} strokeDasharray="5 5" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. New Users Over Time (Area Chart) */}
                <div className="card-concrete p-6">
                    <h3 className="text-lg font-bold mb-6">User Registration Growth</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={userData}>
                                <defs>
                                    <linearGradient id="colorAdvertiser" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorOwner" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="month" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend />
                                <Area type="monotone" dataKey="advertisers" name="Advertisers" stroke="var(--primary)" fillOpacity={1} fill="url(#colorAdvertiser)" />
                                <Area type="monotone" dataKey="owners" name="Wall Owners" stroke="var(--accent)" fillOpacity={1} fill="url(#colorOwner)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* CHARTS GRID 2: Bars & Donuts */}
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
                {/* 2. Bookings by City (Horizontal Bar) */}
                <div className="card-concrete p-6 lg:col-span-1">
                    <h3 className="text-lg font-bold mb-6">Bookings by City</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cityData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                <XAxis type="number" stroke="#888" />
                                <YAxis dataKey="city" type="category" stroke="#888" width={80} />
                                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="bookings" name="Bookings" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Ad Format Popularity (Donut) */}
                <div className="card-concrete p-6 lg:col-span-1">
                    <h3 className="text-lg font-bold mb-6">Format Popularity</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={formatData}
                                    cx="50%" cy="50%"
                                    innerRadius={70} outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {formatData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={formatColors[index % formatColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 7. Booking Status Breakdown (Stacked Bar) */}
                <div className="card-concrete p-6 lg:col-span-1">
                    <h3 className="text-lg font-bold mb-6">Booking Status</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="month" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Legend />
                                <Bar dataKey="confirmed" name="Confirmed" stackId="a" fill="var(--success)" />
                                <Bar dataKey="pending" name="Pending" stackId="a" fill="var(--warning)" />
                                <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill="var(--danger)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* CHARTS GRID 3: Grouped Bar & Approvals */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* 8. Revenue by Ad Format (Grouped Bar) */}
                <div className="card-concrete p-6">
                    <h3 className="text-lg font-bold mb-6">Revenue by Format</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revFormatData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="month" stroke="#888" />
                                <YAxis stroke="#888" tickFormatter={(val) => `₹${val / 100000}L`} />
                                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Legend />
                                <Bar dataKey="led" name="LED Wall" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="billboard" name="Billboard" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="transit" name="Transit" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Wall Approvals Queue */}
                <div className="card-concrete flex flex-col h-full">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <h2 className="text-xl font-bold flex items-center gap-3">
                            Approval Queue
                            <span className="bg-danger text-white text-xs px-3 py-1 rounded-full font-bold">{pendingWalls.length}</span>
                        </h2>
                    </div>
                    <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
                        {pendingWalls.map(wall => (
                            <div key={wall._id} className="p-4 border-b border-gray-800 flex justify-between items-center" style={{ backgroundColor: 'rgba(255, 23, 68, 0.05)' }}>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-12 bg-gray-800 rounded overflow-hidden">
                                        <img src={wall.images?.[0] || 'https://images.unsplash.com/photo-1542204637-e67bc7d41e48?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'} alt="wall" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1 leading-tight">{wall.title}</h4>
                                        <p className="text-xs text-muted">Owner: {wall.owner?.name || 'Unknown'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="btn btn-primary bg-success hover:bg-green-600 text-xs py-1 px-3 shadow-none min-h-0" onClick={() => handleApproveWall(wall._id, 'approved')}>Approve</button>
                                    <button className="btn btn-outline border-danger text-danger hover:bg-danger hover:text-white text-xs py-1 px-3 min-h-0" onClick={() => handleApproveWall(wall._id, 'rejected')}>Reject</button>
                                </div>
                            </div>
                        ))}
                        {pendingWalls.length === 0 && (
                            <div className="p-8 text-center text-muted flex flex-col items-center justify-center h-full">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20 mb-4">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                <p>All caught up! No walls pending approval.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
