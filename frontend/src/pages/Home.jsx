import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import WallCard from '../components/WallCard';

const Home = () => {
    const [walls, setWalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ city: '', locationType: '', trafficLevel: '', type: '', priceRange: '', size: '', availability: '' });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        // For MVP/Demo purposes if backend is empty, we will inject mock data later or fetch from live DB
        const fetchWalls = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/walls');
                setWalls(res.data);
            } catch (err) {
                console.error('Failed to fetch walls', err);
                // Fallback mock data if server isn't running or returns error
                setWalls([
                    {
                        _id: '1', title: 'Times Square Style Billboard', type: 'LED Video Wall', locationType: 'Commercial Area', trafficLevel: 'High Traffic',
                        city: 'Mumbai', location: 'Bandra West Highway', width: 40, height: 20,
                        pricingType: 'per day', basePrice: 25000, trafficEstimate: 150000, availability: 'available',
                        images: ['https://images.unsplash.com/photo-1596489392276-88af700947ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
                    },
                    {
                        _id: '2', title: 'Connaught Place Premium Hoarding', type: 'Static Painted Wall', locationType: 'Market Area', trafficLevel: 'Peak Hour Visibility',
                        city: 'Delhi', location: 'CP Inner Circle', width: 30, height: 15,
                        pricingType: 'monthly', basePrice: 450000, trafficEstimate: 85000, availability: 'available',
                        images: ['https://images.unsplash.com/photo-1542204637-e67bc7d41e48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
                    },
                    {
                        _id: '3', title: 'Tech Park Entrance Display', type: 'Digital Screen', locationType: 'Industrial Area', trafficLevel: 'High Traffic',
                        city: 'Bangalore', location: 'Electronic City Phase 1', width: 15, height: 10,
                        pricingType: 'per sq ft', basePrice: 800, trafficEstimate: 45000, availability: 'available',
                        images: ['https://images.unsplash.com/photo-1620600492862-2ca8b44917ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
                    },
                    {
                        _id: '4', title: 'Pune Highway Static Wall', type: 'Flex Banner Wall', locationType: 'Highway', trafficLevel: '24/7 Visibility',
                        city: 'Pune', location: 'Mumbai-Pune Expressway', width: 60, height: 20,
                        pricingType: 'monthly', basePrice: 320000, trafficEstimate: 120000, availability: 'available',
                        images: ['https://images.unsplash.com/photo-1563200155-276ceb7941cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchWalls();
    }, []);

    const filteredWalls = walls.filter(w => {
        let match = true;
        if (filter.city && !w.city.toLowerCase().includes(filter.city.toLowerCase())) match = false;
        if (filter.locationType && w.locationType !== filter.locationType) match = false;
        if (filter.trafficLevel && w.trafficLevel !== filter.trafficLevel) match = false;
        if (filter.type && w.type !== filter.type) match = false;
        if (filter.availability && w.availability !== filter.availability) match = false;

        if (filter.priceRange) {
            const price = w.basePrice;
            if (filter.priceRange === 'Under 5k' && price >= 5000) match = false;
            if (filter.priceRange === '5k-15k' && (price < 5000 || price > 15000)) match = false;
            if (filter.priceRange === '15k-50k' && (price < 15000 || price > 50000)) match = false;
            if (filter.priceRange === '50k+' && price <= 50000) match = false;
        }

        if (filter.size) {
            const area = w.width * w.height;
            if (filter.size === 'Small' && area >= 100) match = false;
            if (filter.size === 'Medium' && (area < 100 || area > 300)) match = false;
            if (filter.size === 'Large' && area <= 300) match = false;
        }
        return match;
    });

    return (
        <div className="animate-fade-in pb-10">
            {/* Hero Section */}
            <section className="hero text-center py-10 mb-8 billboard-glow" style={{ position: 'relative' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
                    Dominate The <span className="text-gradient">Urban Canvas</span>
                </h1>
                <p className="text-muted mb-4" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                    India's premium outdoor advertising marketplace. Book billboards, LED walls, and transit ads instantly with smart pricing.
                </p>

                {/* Smart Filters Concept */}
                <div className="card-concrete" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem' }}>

                    {/* Primary Dropdowns Row */}
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div style={{ flex: '2' }}>
                            <select
                                className="form-control"
                                value={filter.locationType}
                                onChange={e => setFilter({ ...filter, locationType: e.target.value })}
                                style={{ margin: 0, border: '1px solid var(--primary)', height: '100%', fontSize: '1.1rem', fontWeight: 'bold' }}
                            >
                                <option value="">🎯 Location Type (All)</option>
                                <option value="Commercial Area">🏢 Commercial Area</option>
                                <option value="Residential Area">🏘️ Residential Area</option>
                                <option value="Highway">🛣️ Highway</option>
                                <option value="Market Area">🛒 Market Area</option>
                                <option value="Near Mall">🛍️ Near Mall</option>
                                <option value="Near College/School">🎓 Near College/School</option>
                                <option value="Near Hospital">🏥 Near Hospital</option>
                                <option value="Metro/Bus Stand">🚇 Metro/Bus Stand</option>
                                <option value="Industrial Area">🏭 Industrial Area</option>
                            </select>
                        </div>
                        <div style={{ flex: '1', display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                className="form-control flex-grow"
                                placeholder="Search City..."
                                value={filter.city}
                                onChange={e => setFilter({ ...filter, city: e.target.value })}
                                style={{ margin: 0, height: '100%' }}
                            />
                            <button
                                className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setShowFilters(!showFilters)}
                                style={{ padding: '0 1.5rem', height: '100%', margin: 0 }}
                            >
                                ⧸ Filters
                            </button>
                        </div>
                    </div>

                    {/* Secondary Row (More Granular Smart Filters) */}
                    {showFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-sm mt-4 pt-4 border-t border-gray-800 animate-fade-in">
                            <select className="form-control py-2 text-sm" value={filter.trafficLevel} onChange={e => setFilter({ ...filter, trafficLevel: e.target.value })}>
                                <option value="">🚦 Traffic Level</option>
                                <option value="High Traffic">High Traffic</option>
                                <option value="Medium Traffic">Medium Traffic</option>
                                <option value="Low Traffic">Low Traffic</option>
                                <option value="24/7 Visibility">24/7 Visibility</option>
                                <option value="Peak Hour Visibility">Peak Hour Visibility</option>
                            </select>
                            <select className="form-control py-2 text-sm" value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}>
                                <option value="">📺 Display Format</option>
                                <option value="Static Painted Wall">Static Painted</option>
                                <option value="Flex Banner Wall">Flex Banner</option>
                                <option value="LED Video Wall">LED Video</option>
                                <option value="Digital Screen">Digital Screen</option>
                                <option value="Backlit Board">Backlit Board</option>
                                <option value="Glow Sign Board">Glow Sign</option>
                            </select>
                            <select className="form-control py-2 text-sm" value={filter.priceRange} onChange={e => setFilter({ ...filter, priceRange: e.target.value })}>
                                <option value="">💰 Price Range</option>
                                <option value="Under 5k">Under ₹5,000</option>
                                <option value="5k-15k">₹5,000 – ₹15k</option>
                                <option value="15k-50k">₹15k – ₹50k</option>
                                <option value="50k+">₹50,000+</option>
                            </select>
                            <select className="form-control py-2 text-sm" value={filter.size} onChange={e => setFilter({ ...filter, size: e.target.value })}>
                                <option value="">📏 Wall Size</option>
                                <option value="Small">Small (&lt;100 sq ft)</option>
                                <option value="Medium">Med (100-300 sq ft)</option>
                                <option value="Large">Large (300+ sq ft)</option>
                            </select>
                            <select className="form-control py-2 text-sm" value={filter.availability} onChange={e => setFilter({ ...filter, availability: e.target.value })}>
                                <option value="">🟢 Availability</option>
                                <option value="available">Available Now</option>
                                <option value="booked">Booked</option>
                            </select>
                        </div>
                    )}
                </div>
            </section>

            {/* Listings Section */}
            <section>
                <div className="flex justify-between items-center mb-4 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 style={{ fontSize: '1.8rem' }}>Available Spaces</h2>
                    <span className="text-muted">{filteredWalls.length} listings found</span>
                </div>

                {loading ? (
                    <div className="text-center py-10">
                        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,51,102,0.3)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                        <p className="mt-2 text-muted">Loading available spaces...</p>
                        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
                        {filteredWalls.map(wall => (
                            <Link to={`/wall/${wall._id}`} key={wall._id} style={{ display: 'block' }}>
                                <WallCard wall={wall} />
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
