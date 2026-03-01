import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../utils/useAuth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdvertiserDashboard = () => {
    const { user, token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulated fetch for dashboard
        const fetchDashboard = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/bookings/advertiser/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(res.data);
            } catch (err) {
                // Mock data
                setBookings([
                    {
                        _id: 'bkg_1',
                        wall: { title: 'Connaught Place Premium Hoarding', type: 'Premium Metro Wallscape' },
                        startDate: '2026-03-01T00:00:00',
                        endDate: '2026-03-31T00:00:00',
                        totalAmount: 512000, // INR
                        cpm: 125.50,
                        totalImpressions: 2500000,
                        status: 'approved'
                    },
                    {
                        _id: 'bkg_2',
                        wall: { title: 'Times Square Style Billboard', type: 'Outdoor LED Video Wall' },
                        startDate: '2026-04-10T00:00:00',
                        endDate: '2026-04-15T00:00:00',
                        totalAmount: 185000, // INR
                        cpm: 246.60,
                        totalImpressions: 750000,
                        status: 'pending_approval'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchDashboard();
    }, [token]);

    const totalSpend = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalImpressionsAll = bookings.reduce((sum, b) => sum + b.totalImpressions, 0);
    const avgCpmSum = bookings.reduce((sum, b) => sum + b.cpm, 0);
    const avgCpm = bookings.length > 0 ? (avgCpmSum / bookings.length).toFixed(2) : 0;

    const handleCancel = async (id) => {
        // simulate cancel
        if (window.confirm('Cancel this pending booking request?')) {
            setBookings(bookings.filter(b => b._id !== id));
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="bg-success text-dark text-xs font-bold px-2 py-1 rounded">ACTIVE</span>;
            case 'pending_approval': return <span className="bg-warning text-dark text-xs font-bold px-2 py-1 rounded">AWAITING OWNER</span>;
            default: return <span className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">{status}</span>;
        }
    };

    // Prepare Chart Data
    const chartData = bookings.map(b => ({
        name: b.wall ? b.wall.title.substring(0, 15) + '...' : 'Deleted Wall', // Shorten names
        spend: b.totalAmount,
        impressions: b.totalImpressions
    }));

    return (
        <div className="animate-fade-in pb-10">
            <h1 className="text-3xl mb-2">Advertiser Control Center</h1>
            <p className="text-muted mb-8">Manage your outdoor campaigns and track ROI.</p>

            {/* Stats Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card-concrete p-6 border-l-4" style={{ borderLeftColor: 'var(--primary)' }}>
                    <h3 className="text-sm text-muted uppercase tracking-wider mb-2">Total Budget Spent</h3>
                    <p className="text-3xl font-bold">₹{totalSpend.toLocaleString()}</p>
                </div>
                <div className="card-concrete p-6 border-l-4" style={{ borderLeftColor: 'var(--accent)' }}>
                    <h3 className="text-sm text-muted uppercase tracking-wider mb-2">Total Impressions</h3>
                    <p className="text-3xl font-bold">{(totalImpressionsAll).toLocaleString()}</p>
                </div>
                <div className="card-concrete p-6 border-l-4" style={{ borderLeftColor: 'var(--success)' }}>
                    <h3 className="text-sm text-muted uppercase tracking-wider mb-2">Avg. CPM Efficiency</h3>
                    <p className="text-3xl font-bold">₹{avgCpm}</p>
                </div>
            </div>

            {/* Analytics Chart */}
            {bookings.length > 0 && (
                <div className="card-concrete mb-8">
                    <div className="p-6 border-b border-gray-800" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <h2 className="text-xl">Campaign Performance Overview</h2>
                    </div>
                    <div className="p-6" style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                                <YAxis yAxisId="left" orientation="left" stroke="var(--primary)" fontSize={12} />
                                <YAxis yAxisId="right" orientation="right" stroke="var(--accent)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--text-main)' }}
                                />
                                <Legend />
                                <Bar yAxisId="left" dataKey="spend" name="Spend (₹)" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="right" dataKey="impressions" name="Impressions" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            <div className="card-concrete">
                <div className="p-6 border-b border-gray-800" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 className="text-xl">Your Campaigns</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                        <thead className="bg-dark text-muted text-sm uppercase">
                            <tr>
                                <th className="p-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Wall / Location</th>
                                <th className="p-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Duration</th>
                                <th className="p-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Spend</th>
                                <th className="p-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Performance</th>
                                <th className="p-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Status</th>
                                <th className="p-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', ':hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                                    <td className="p-4">
                                        <p className="font-bold text-sm">{booking.wall ? booking.wall.title : 'Deleted Wall'}</p>
                                        <p className="text-xs text-muted">{booking.wall ? booking.wall.type : 'N/A'}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm">{new Date(booking.startDate).toLocaleDateString()}</p>
                                        <p className="text-xs text-muted">to {new Date(booking.endDate).toLocaleDateString()}</p>
                                    </td>
                                    <td className="p-4 font-bold">₹{booking.totalAmount.toLocaleString()}</td>
                                    <td className="p-4">
                                        <p className="text-sm text-accent">👁 {booking.totalImpressions.toLocaleString()}</p>
                                        <p className="text-xs text-muted">CPM: ₹{booking.cpm.toFixed(2)}</p>
                                    </td>
                                    <td className="p-4">{getStatusBadge(booking.status)}</td>
                                    <td className="p-4">
                                        {booking.status === 'pending_approval' && (
                                            <button
                                                onClick={() => handleCancel(booking._id)}
                                                className="text-xs text-danger border border-danger p-1 px-2 rounded hover:bg-danger hover:text-white"
                                                style={{ border: '1px solid var(--danger)', background: 'transparent', transition: 'all 0.2s', cursor: 'pointer' }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-muted">No campaigns found. Head to the Marketplace to book a wall.</td>
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
