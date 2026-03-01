import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../utils/useAuth';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const { token } = useAuth();
    const [walls, setWalls] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [wallsRes, bookingsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/walls/admin/all', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/bookings/admin/all', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setWalls(wallsRes.data);
                setBookings(bookingsRes.data);
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
            console.warn('API error, demo update used.');
        }
    };

    const handleRemoveWall = async (id) => {
        if (!window.confirm("Are you sure you want to completely delete this wall from the system?")) return;
        try {
            // Reusing owner's delete endpoint but updating permissions in backend
            await axios.delete(`http://localhost:5000/api/walls/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setWalls(walls.filter(w => w._id !== id));
        } catch (e) {
            setWalls(walls.filter(w => w._id !== id));
            console.warn('API delete error, removed locally for demo.');
        }
    };

    // Analytics
    const totalRevenue = bookings.filter(b => b.status === 'approved' || b.status === 'completed').reduce((sum, b) => sum + b.totalAmount, 0);
    const totalCommission = bookings.filter(b => b.status === 'approved' || b.status === 'completed').reduce((sum, b) => sum + b.commission, 0);
    const totalGST = bookings.filter(b => b.status === 'approved' || b.status === 'completed').reduce((sum, b) => sum + b.gst, 0);

    const pendingWalls = walls.filter(w => w.status === 'pending_approval');

    // Chart Data Preparation
    const approvedCount = walls.filter(w => w.status === 'approved').length;
    const pendingCount = pendingWalls.length;

    const statusData = [
        { name: 'Approved & Active', value: approvedCount, color: 'var(--success)' },
        { name: 'Pending Review', value: pendingCount, color: 'var(--warning)' }
    ];

    const COLORS = statusData.map(entry => entry.color);

    return (
        <div className="animate-fade-in pb-10">
            <h1 className="text-3xl mb-2 text-danger">Platform Administration</h1>
            <p className="text-muted mb-8">System overview, wall approvals, and revenue analytics.</p>

            {/* Global Revenue Stats */}
            <h2 className="text-xl mb-4 text-gradient">Financial Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card-concrete p-6 border-t-2" style={{ borderTopColor: 'var(--accent)' }}>
                    <h3 className="text-sm text-muted uppercase tracking-wider mb-2">Total Platform Volume</h3>
                    <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="card-concrete p-6 border-t-2" style={{ borderTopColor: 'var(--success)' }}>
                    <h3 className="text-sm text-muted uppercase tracking-wider mb-2">Platform Earnings (10%)</h3>
                    <p className="text-3xl font-bold text-success">₹{totalCommission.toLocaleString()}</p>
                </div>
                <div className="card-concrete p-6 border-t-2" style={{ borderTopColor: 'var(--warning)' }}>
                    <h3 className="text-sm text-muted uppercase tracking-wider mb-2">GST Collected (18%)</h3>
                    <p className="text-3xl font-bold text-warning">₹{totalGST.toLocaleString()}</p>
                </div>
            </div>

            {/* Platform Analytics Chart */}
            <div className="card-concrete mb-8">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 className="text-xl">Platform Inventory Status</h2>
                </div>
                <div className="p-6 flex justify-center" style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ color: 'var(--text-main)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Wall Approvals */}
                <div className="card-concrete">
                    <div className="p-4 border-b border-gray-800 flex justify-between">
                        <h2 className="text-xl flex items-center gap-2">
                            Needs Approval
                            <span className="bg-danger text-white text-xs px-2 py-1 rounded-full">{pendingWalls.length}</span>
                        </h2>
                    </div>
                    <div className="p-0 max-h-96 overflow-y-auto">
                        {pendingWalls.map(wall => (
                            <div key={wall._id} className="p-4 border-b border-gray-800 flex justify-between items-center" style={{ backgroundColor: 'rgba(255, 23, 68, 0.05)' }}>
                                <div className="flex items-center gap-4">
                                    <img src={wall.images?.[0] || 'https://images.unsplash.com/photo-1542204637-e67bc7d41e48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt="wall" className="w-24 h-16 object-cover rounded flex-shrink-0 border border-gray-700" />
                                    <div>
                                        <h4 className="font-bold">{wall.title}</h4>
                                        <p className="text-xs text-muted mt-1">Owner: {wall.owner?.name}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="btn btn-outline text-success border-success text-xs px-2 py-1" onClick={() => handleApproveWall(wall._id, 'approved')}>Approve</button>
                                    <button className="btn btn-outline text-danger border-danger text-xs px-2 py-1" onClick={() => handleApproveWall(wall._id, 'rejected')}>Reject</button>
                                </div>
                            </div>
                        ))}
                        {pendingWalls.length === 0 && <div className="p-6 text-center text-muted border-b border-gray-800">No walls pending approval.</div>}

                        {/* Display Approved Walls for Deletion/Management */}
                        <div className="p-4 border-b border-gray-800 flex justify-between bg-dark mt-2" style={{ backgroundColor: '#13151a' }}>
                            <h2 className="text-xl flex items-center gap-2">
                                Approved Walls
                            </h2>
                        </div>
                        {walls.filter(w => w.status === 'approved').map(wall => (
                            <div key={wall._id} className="p-4 border-b border-gray-800 flex justify-between items-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                                <div className="flex items-center gap-4">
                                    <img src={wall.images?.[0] || 'https://images.unsplash.com/photo-1542204637-e67bc7d41e48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt="wall" className="w-24 h-16 object-cover rounded flex-shrink-0 border border-gray-700" />
                                    <div>
                                        <h4 className="font-bold">{wall.title}</h4>
                                        <p className="text-xs text-muted mt-1">Owner: {wall.owner?.name}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className="text-success text-xs font-bold px-2 py-1 mr-2">✓ Approved</span>
                                    <button className="btn btn-outline text-danger border-danger text-xs px-2 py-1" onClick={() => handleRemoveWall(wall._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Global Controls */}
                <div className="card-concrete p-6">
                    <h2 className="text-xl mb-6">Global Settings</h2>

                    <div className="flex items-center justify-between p-4 bg-dark rounded mb-4" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                            <h4 className="font-bold mb-1">Seasonal Peak Pricing</h4>
                            <p className="text-xs text-muted">Automatically adds 10% premium to all wall prices.</p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                            <input type="checkbox" name="toggle" id="toggle1" defaultChecked className="checked:bg-success outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" style={{ right: 0, borderColor: 'var(--success)' }} />
                            <label htmlFor="toggle1" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}></label>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-dark rounded" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                            <h4 className="font-bold mb-1">Platform Commission Rate</h4>
                            <p className="text-xs text-muted">Default cut taken from completed bookings.</p>
                        </div>
                        <div className="w-24">
                            <div className="flex bg-concrete rounded overflow-hidden" style={{ border: '1px solid var(--accent)' }}>
                                <input type="number" defaultValue={10} className="w-full bg-transparent text-center outline-none text-white font-bold p-1" />
                                <span className="bg-accent text-dark px-2 py-1 font-bold">%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
