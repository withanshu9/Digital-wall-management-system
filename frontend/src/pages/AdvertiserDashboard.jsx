import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../utils/useAuth';
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdvertiserDashboard = () => {
    const { user, token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [bookingsRes, statsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/bookings/advertiser/me', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/dashboards/advertiser', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setBookings(bookingsRes.data.filter(b => b.wall != null));
                setStats(statsRes.data);
            } catch (err) {
                // Mock data
                setBookings([
                    {
                        _id: 'bkg_1',
                        wall: { title: 'Connaught Place Premium Hoarding', type: 'Billboard' },
                        startDate: '2026-03-01T00:00:00',
                        endDate: '2026-03-31T00:00:00',
                        totalAmount: 512000,
                        cpm: 125.50,
                        totalImpressions: 4079681,
                        status: 'approved'
                    },
                    {
                        _id: 'bkg_2',
                        wall: { title: 'Times Square Style Billboard', type: 'LED Wall' },
                        startDate: '2026-04-10T00:00:00',
                        endDate: '2026-04-15T00:00:00',
                        totalAmount: 185000,
                        cpm: 246.60,
                        totalImpressions: 750202,
                        status: 'pending_approval'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchDashboard();
    }, [token]);

    const totalSpend = stats?.totalSpend || bookings.reduce((sum, b) => sum + b.totalAmount, 0) || 697000;
    const totalImpressionsAll = stats?.totalImpressions || bookings.reduce((sum, b) => sum + (b.totalImpressions || 0), 0) || 4829883;
    const avgCpmSum = bookings.reduce((sum, b) => sum + (b.cpm || 0), 0);
    const avgCpm = bookings.length > 0 ? (avgCpmSum / bookings.length).toFixed(2) : 186.05;

    // MOCK DATA FOR CHARTS
    const impressionsData = [
        { day: '1 Mar', impressions: 45000 },
        { day: '5 Mar', impressions: 52000 },
        { day: '10 Mar', impressions: 48000 },
        { day: '15 Mar', impressions: 61000 },
        { day: '20 Mar', impressions: 59000 },
        { day: '25 Mar', impressions: 72000 },
        { day: '30 Mar', impressions: 85000 }
    ];

    const budgetAllocationData = [
        { name: 'Billboard', value: 512000 },
        { name: 'LED Wall', value: 185000 }
    ];
    const formatColors = ['var(--primary)', 'var(--accent)', '#10B981', '#38BDF8'];

    const performanceData = bookings.map(b => ({
        name: b.wall ? b.wall.title.substring(0, 15) + '...' : 'Unknown',
        spend: b.totalAmount,
        impressions: b.totalImpressions
    }));

    const handleCancel = async (id) => {
        if (window.confirm('Cancel this pending booking request?')) {
            try {
                await axios.delete(`http://localhost:5000/api/bookings/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                setBookings(bookings.filter(b => b._id !== id));
            } catch (err) {
                alert("Failed to cancel the booking. Please try again.");
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed': case 'approved': return <span className="bg-success text-dark text-xs font-bold px-2 py-1 rounded">ACTIVE</span>;
            case 'pending': return <span className="bg-warning text-dark text-xs font-bold px-2 py-1 rounded">PENDING PAYMENT</span>;
            case 'pending_approval': return <span className="bg-info text-dark text-xs font-bold px-2 py-1 rounded">AWAITING OWNER</span>;
            default: return <span className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">{status}</span>;
        }
    };

    const tooltipStyle = { backgroundColor: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-main)' };

    return (
        <div className="animate-fade-in pb-12 overflow-hidden">
            <h1 className="text-3xl mb-1 text-primary font-bold">Advertiser Dashboard</h1>
            <p className="text-muted mb-8 tracking-wide">Manage campaigns, monitor spend, and track ROI.</p>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card-concrete p-6 border-l-4" style={{ borderLeftColor: 'var(--primary)' }}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xs text-muted font-bold uppercase tracking-wider mb-2">My Spend This Month</h3>
                            <p className="text-3xl font-black">₹{totalSpend.toLocaleString()}</p>
                        </div>
                        <div className="p-2 bg-dark rounded-lg text-primary">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        </div>
                    </div>
                    <div className="w-full bg-gray-800 h-1.5 mt-4 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: '70%' }}></div>
                    </div>
                    <p className="text-xs text-muted mt-2">70% of monthly budget utilized</p>
                </div>

                <div className="card-concrete p-6 border-l-4" style={{ borderLeftColor: 'var(--accent)' }}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xs text-muted font-bold uppercase tracking-wider mb-2">Total Impressions</h3>
                            <p className="text-3xl font-black text-white">{totalImpressionsAll.toLocaleString()}</p>
                        </div>
                        <div className="p-2 bg-dark rounded-lg text-accent">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </div>
                    </div>
                    <p className="text-xs text-success mt-4 font-bold">+24% vs last month</p>
                </div>

                <div className="card-concrete p-6 border-l-4" style={{ borderLeftColor: 'var(--success)' }}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xs text-muted font-bold uppercase tracking-wider mb-2">Avg. CPM</h3>
                            <p className="text-3xl font-black">₹{avgCpm}</p>
                        </div>
                        <div className="p-2 bg-dark rounded-lg text-success">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                        </div>
                    </div>
                    <p className="text-xs text-muted mt-4">Highly efficient delivery rate</p>
                </div>
            </div>

            {/* CHARTS ROW */}
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
                {/* 1. Impressions Over Time (Area Chart) */}
                <div className="card-concrete p-6 lg:col-span-2">
                    <h3 className="text-lg font-bold mb-6">Campaign Impressions (March)</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={impressionsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="day" stroke="#888" />
                                <YAxis stroke="#888" tickFormatter={(val) => `${val / 1000}k`} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Area type="monotone" dataKey="impressions" name="Views" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorImp)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Budget Allocation (Donut) */}
                <div className="card-concrete p-6 lg:col-span-1">
                    <h3 className="text-lg font-bold mb-6">Budget Allocation</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={budgetAllocationData}
                                    cx="50%" cy="50%"
                                    innerRadius={70} outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {budgetAllocationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={formatColors[index % formatColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} formatter={(value) => `₹${value.toLocaleString()}`} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Campaign Table */}
            <div className="card-concrete">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 className="text-xl font-bold">Active & Pending Campaigns</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                        <thead className="bg-dark text-muted text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4 py-3 font-bold" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Wall / Location</th>
                                <th className="p-4 py-3 font-bold" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Duration</th>
                                <th className="p-4 py-3 font-bold" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Spend</th>
                                <th className="p-4 py-3 font-bold" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Performance</th>
                                <th className="p-4 py-3 font-bold" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Status</th>
                                <th className="p-4 py-3 font-bold text-right" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold text-sm text-white mb-1">{booking.wall ? booking.wall.title : 'Deleted Wall'}</p>
                                        <span className="text-xs bg-dark px-2 py-1 rounded text-muted border border-gray-700">{booking.wall ? booking.wall.type : 'N/A'}</span>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm font-medium">{new Date(booking.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(booking.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                                    </td>
                                    <td className="p-4 font-bold text-primary">₹{booking.totalAmount.toLocaleString()}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1 text-sm font-bold text-white mb-1">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            {booking.totalImpressions.toLocaleString()}
                                        </div>
                                        <p className="text-xs text-muted">CPM: ₹{booking.cpm.toFixed(2)}</p>
                                    </td>
                                    <td className="p-4">{getStatusBadge(booking.bookingStatus || booking.status)}</td>
                                    <td className="p-4 text-right">
                                        {(['pending', 'confirmed', 'active'].includes(booking.bookingStatus) || ['pending_payment', 'pending_approval', 'pending', 'approved'].includes(booking.status)) && (
                                            <button
                                                onClick={() => handleCancel(booking._id)}
                                                className="text-xs text-danger font-bold hover:underline"
                                            >
                                                Cancel Request
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-muted">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto opacity-20 mb-4"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                                        <p>No active campaigns found. Head to the Marketplace to book your first wall.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdvertiserDashboard;
