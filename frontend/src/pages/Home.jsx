import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import WallCard from '../components/WallCard';
import useAuth from '../utils/useAuth';

const Home = () => {
    const { user } = useAuth();
    const [walls, setWalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLocations, setShowLocations] = useState(false);
    // Availability 'available' on by default
    const [filter, setFilter] = useState({ city: '', locationType: '', trafficLevel: '', type: '', priceRange: '', size: '', availability: 'available', sort: '' });

    // Interactive Grid Mouse Tracking
    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            document.documentElement.style.setProperty('--mouse-x', `${clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${clientY}px`);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const fetchWalls = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/walls');
                setWalls(res.data);
            } catch (err) {
                console.error('Failed to fetch walls', err);
                // Fallback mock data
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
                        pricingType: 'monthly', basePrice: 450000, trafficEstimate: 85000, availability: 'booked',
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

    let filteredWalls = walls.filter(w => {
        let match = true;
        if (filter.city && !w.city.toLowerCase().includes(filter.city.toLowerCase())) match = false;
        if (filter.locationType && w.locationType !== filter.locationType) match = false;
        if (filter.trafficLevel && w.trafficLevel !== filter.trafficLevel) match = false;
        if (filter.type && w.type !== filter.type) match = false;
        if (filter.availability && w.availability !== filter.availability) match = false;

        if (filter.priceRange) {
            const price = w.basePrice;
            if (filter.priceRange === 'Under 15k' && price >= 15000) match = false;
            if (filter.priceRange === '15k-50k' && (price < 15000 || price > 50000)) match = false;
            if (filter.priceRange === '50k+' && price <= 50000) match = false;
        }

        if (filter.size) {
            const area = w.width * w.height;
            if (filter.size === 'Small' && area >= 100) match = false;
            if (filter.size === 'Medium' && (area < 100 || area > 500)) match = false;
            if (filter.size === 'Large' && area <= 500) match = false;
        }
        return match;
    });

    // Sorting
    if (filter.sort === 'Price (Low to High)') {
        filteredWalls.sort((a, b) => a.basePrice - b.basePrice);
    } else if (filter.sort === 'Traffic (Highest First)') {
        filteredWalls.sort((a, b) => b.trafficEstimate - a.trafficEstimate);
    } else if (filter.sort === 'Newest Listed') {
        filteredWalls.sort((a, b) => b._id.localeCompare(a._id));
    }

    const scrollToSpaces = () => {
        setShowLocations(true);
        setTimeout(() => {
            const el = document.getElementById('browse-spaces');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <div className="animate-fade-in" style={{
            marginTop: '-80px',
            backgroundColor: '#0a0a0f',
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* INTERACTIVE BACKGROUND GRID */}
            <div className="interactive-bg-grid" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                pointerEvents: 'none',
                backgroundSize: '40px 40px',
                backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
                maskImage: 'radial-gradient(circle 350px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(circle 350px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)',
                transition: 'mask-position 0.1s ease-out, -webkit-mask-position 0.1s ease-out'
            }}>
                {/* Simulated zoom effect layer */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundSize: '42px 42px', /* Slightly larger grid to create "zoom" feeling */
                    backgroundImage: `linear-gradient(to right, rgba(232, 93, 4, 0.05) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(232, 93, 4, 0.05) 1px, transparent 1px)`,
                    maskImage: 'radial-gradient(circle 150px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 10%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(circle 150px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 10%, transparent 100%)',
                }}></div>
            </div>

            {/* SECTION 1: HERO */}
            <section className="hero relative z-10" style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '160px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }}>
                    {/* Left Text Content */}
                    <div style={{ flex: '1 1 400px' }}>
                        <h1 className="page-title animate-fade-in" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.9)', marginBottom: '1.5rem', textAlign: 'left', lineHeight: '1.1' }}>
                            Dominate The <br /><span className="text-gradient">Urban Canvas</span>
                        </h1>
                        <p style={{ color: '#BBBBBB', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '2.5rem', maxWidth: '500px' }}>
                            India's premium outdoor advertising marketplace. Connect with top brand advertisers or book premium billboards, LED walls, and transit ads instantly.
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                            <button onClick={scrollToSpaces} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                Browse Spaces
                            </button>
                            <Link to={user ? `/dashboard/${user.role}` : '/register'} className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(5px)' }}>
                                List Your Wall
                            </Link>
                        </div>
                    </div>

                    {/* Right Visual/Images Container */}
                    <div className="animate-fade-in" style={{ flex: '1 1 400px', position: 'relative', height: '500px', perspective: '1000px' }}>
                        <div className="billboard-glow" style={{ position: 'absolute', top: '10%', right: '0', width: '80%', height: '80%', background: 'linear-gradient(45deg, var(--primary), #FFD60A)', borderRadius: '16px', filter: 'blur(40px)', opacity: 0.3 }}></div>

                        <div style={{ position: 'absolute', top: '5%', right: '5%', width: '70%', height: '60%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 3, transform: 'rotateX(5deg) rotateY(-10deg) rotateZ(2deg) translateY(0)', transition: 'transform 0.3s' }}>
                            <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', color: '#fff', zIndex: 4 }}>PREMIUM LED</div>
                            <img src="/assets/hero_led_billboard.png" alt="Billboard 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        {/* Secondary Floating Image */}
                        <div style={{ position: 'absolute', bottom: '5%', left: '0', width: '60%', height: '50%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 2, transform: 'rotateX(5deg) rotateY(10deg) rotateZ(-3deg)', transition: 'transform 0.3s' }}>
                            <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', color: '#fff', zIndex: 4 }}>HIGH TRAFFIC</div>
                            <img src="/assets/ad_format_flex.png" alt="Billboard 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: PLATFORM STATS */}
            <section className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', backgroundColor: 'rgba(30, 30, 46, 0.6)', backdropFilter: 'blur(16px)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '3.5rem', fontWeight: '900', margin: '0 0 8px 0', lineHeight: '1', color: '#FFD60A' }}>500<span style={{ fontSize: '2rem' }}>+</span></h3>
                        <span style={{ color: '#BBBBBB', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Spaces Available</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '3.5rem', fontWeight: '900', margin: '0 0 8px 0', lineHeight: '1', color: '#FFD60A' }}>12</h3>
                        <span style={{ color: '#BBBBBB', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Cities Covered</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '3.5rem', fontWeight: '900', margin: '0 0 8px 0', lineHeight: '1', color: '#FFD60A' }}>2Cr<span style={{ fontSize: '2rem' }}>+</span></h3>
                        <span style={{ color: '#BBBBBB', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Monthly Views</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '3.5rem', fontWeight: '900', margin: '0 0 8px 0', lineHeight: '1', color: '#FFD60A' }}>200<span style={{ fontSize: '2rem' }}>+</span></h3>
                        <span style={{ color: '#BBBBBB', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Brands Advertising</span>
                    </div>
                </div>
            </section>

            {/* BROWSE SPACES & FILTERS (Moved up) */}
            <section id="browse-spaces" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px', position: 'relative', zIndex: 10, minHeight: showLocations ? '60vh' : 'auto' }}>
                <div
                    className="group"
                    onClick={() => setShowLocations(!showLocations)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', cursor: 'pointer', userSelect: 'none', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(232,93,4,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e85d04', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            {showLocations ? '−' : '+'}
                        </div>
                        <div>
                            <h2 className="section-title" style={{ margin: 0, fontSize: '1.8rem' }}>Search & Filters</h2>
                            <p style={{ color: '#BBBBBB', fontSize: '0.9rem', marginTop: '4px', margin: 0 }}>{showLocations ? 'Click to hide filter options' : 'Click to filter locations, price, and formats'}</p>
                        </div>
                    </div>
                </div>

                {showLocations && (
                    <div className="animate-fade-in" style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
                            {/* Availability Toggle - Fixed Colors and Padding */}
                            <div style={{ display: 'flex', backgroundColor: '#1A1A2E', padding: '6px', borderRadius: '10px', border: '1px solid #2A2E35' }}>
                                <button
                                    onClick={() => setFilter({ ...filter, availability: '' })}
                                    style={{ padding: '8px 16px', fontSize: '0.9rem', borderRadius: '6px', fontWeight: '600', transition: 'all 0.2s', border: 'none', cursor: 'pointer', backgroundColor: filter.availability === '' ? '#f4a261' : 'transparent', color: filter.availability === '' ? '#1a1a2e' : '#BBBBBB' }}
                                >
                                    Show All
                                </button>
                                <button
                                    onClick={() => setFilter({ ...filter, availability: 'available' })}
                                    style={{ padding: '8px 16px', fontSize: '0.9rem', borderRadius: '6px', fontWeight: '600', transition: 'all 0.2s', border: 'none', cursor: 'pointer', backgroundColor: filter.availability === 'available' ? '#e85d04' : 'transparent', color: filter.availability === 'available' ? '#FFFFFF' : '#BBBBBB' }}
                                >
                                    Available Only
                                </button>
                            </div>
                        </div>

                        {/* Filters Box with proper explicit grid */}
                        <div className="card-concrete" style={{ padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(30, 30, 46, 0.6)', backdropFilter: 'blur(8px)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="🔍 Search City or Area..."
                                    value={filter.city}
                                    onChange={e => setFilter({ ...filter, city: e.target.value })}
                                    style={{
                                        borderColor: filter.city ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '8px'
                                    }}
                                />
                                <select
                                    className="form-control"
                                    value={filter.type}
                                    onChange={e => setFilter({ ...filter, type: e.target.value })}
                                    style={{ borderColor: filter.type ? 'var(--primary)' : 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', width: '100%', padding: '12px 16px', borderRadius: '8px' }}
                                >
                                    <option value="" style={{ color: 'black' }}>📺 Ad Format {filter.type ? '(1 Active)' : '(All)'}</option>
                                    <option value="Static Painted Wall" style={{ color: 'black' }}>Static Painted Wall</option>
                                    <option value="Flex Banner Wall" style={{ color: 'black' }}>Flex Banner</option>
                                    <option value="LED Video Wall" style={{ color: 'black' }}>LED Video Wall</option>
                                    <option value="Digital Screen" style={{ color: 'black' }}>Digital Screen</option>
                                </select>
                                <select
                                    className="form-control"
                                    value={filter.priceRange}
                                    onChange={e => setFilter({ ...filter, priceRange: e.target.value })}
                                    style={{ borderColor: filter.priceRange ? 'var(--primary)' : 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', width: '100%', padding: '12px 16px', borderRadius: '8px' }}
                                >
                                    <option value="" style={{ color: 'black' }}>💰 Price Range {filter.priceRange ? '(1 Active)' : ''}</option>
                                    <option value="Under 15k" style={{ color: 'black' }}>Under ₹15,000</option>
                                    <option value="15k-50k" style={{ color: 'black' }}>₹15,000 – ₹50,000</option>
                                    <option value="50k+" style={{ color: 'black' }}>₹50,000+</option>
                                </select>
                                <select
                                    className="form-control"
                                    value={filter.sort}
                                    onChange={e => setFilter({ ...filter, sort: e.target.value })}
                                    style={{ borderColor: filter.sort ? 'var(--primary)' : 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', width: '100%', padding: '12px 16px', borderRadius: '8px' }}
                                >
                                    <option value="" style={{ color: 'black' }}>⬇️ Sort By {filter.sort ? '(Active)' : ''}</option>
                                    <option value="Price (Low to High)" style={{ color: 'black' }}>Price (Low to High)</option>
                                    <option value="Traffic (Highest First)" style={{ color: 'black' }}>Traffic (Highest First)</option>
                                    <option value="Newest Listed" style={{ color: 'black' }}>Newest Listed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* FEATURED SPACES */}
                <h2 className="section-title mt-8 mb-6" style={{ fontSize: '2rem' }}>Featured Spaces</h2>
                {loading ? (
                    <div className="text-center py-20">
                        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,214,10,0.3)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                        <p className="mt-4 text-muted font-medium tracking-wide">Loading premium spaces...</p>
                        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : filteredWalls.length === 0 ? (
                    <div className="text-center py-20 card-concrete w-full border border-gray-800">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🏜️</div>
                        <h3 className="mb-2">No spaces found</h3>
                        <p className="text-muted max-w-md mx-auto">We couldn't find any listings matching your current filters. Try expanding your search or browse all cities.</p>
                        <button onClick={() => setFilter({ city: '', locationType: '', trafficLevel: '', type: '', priceRange: '', size: '', availability: '', sort: '' })} className="btn btn-outline mt-6">
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', width: '100%', paddingBottom: '40px' }}>
                        {filteredWalls.map(wall => (
                            <WallCard key={wall._id} wall={wall} />
                        ))}
                    </div>
                )}
            </section>

            {/* SECTION 4: HOW IT WORKS (Newly Redesigned Inline) */}
            <section id="how-it-works" style={{ backgroundColor: '#13151a', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '80px 24px', position: 'relative', zIndex: 10 }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 className="section-title" style={{ fontSize: '2.5rem', margin: '0 0 16px 0' }}>How It Works</h2>
                        <p style={{ color: '#BBBBBB', fontSize: '1.1rem' }}>Launch your campaign in four simple steps</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', textAlign: 'center' }}>
                        {/* Step 1 */}
                        <div className="card-concrete" style={{ padding: '40px 24px', borderRadius: '16px', backgroundColor: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                            <div style={{ width: '60px', height: '60px', margin: '0 auto 24px', backgroundColor: 'rgba(232,93,4,0.1)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 0 20px rgba(232,93,4,0.2)' }}>
                                🔍
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px', color: '#fff' }}>Step 1: Browse Spaces</h3>
                            <p style={{ color: '#BBBBBB', fontSize: '0.9rem', lineHeight: '1.6' }}>Search and filter top wall spaces across major cities and formats.</p>
                        </div>
                        {/* Step 2 */}
                        <div className="card-concrete" style={{ padding: '40px 24px', borderRadius: '16px', backgroundColor: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                            <div style={{ width: '60px', height: '60px', margin: '0 auto 24px', backgroundColor: 'rgba(232,93,4,0.1)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 0 20px rgba(232,93,4,0.2)' }}>
                                📍
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px', color: '#fff' }}>Step 2: Choose Location</h3>
                            <p style={{ color: '#BBBBBB', fontSize: '0.9rem', lineHeight: '1.6' }}>Review traffic estimates, dimensions, and select the duration.</p>
                        </div>
                        {/* Step 3 */}
                        <div className="card-concrete" style={{ padding: '40px 24px', borderRadius: '16px', backgroundColor: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                            <div style={{ width: '60px', height: '60px', margin: '0 auto 24px', backgroundColor: 'rgba(232,93,4,0.1)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 0 20px rgba(232,93,4,0.2)' }}>
                                💳
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px', color: '#fff' }}>Step 3: Book Securely</h3>
                            <p style={{ color: '#BBBBBB', fontSize: '0.9rem', lineHeight: '1.6' }}>Confirm pricing and pay online to secure your advertisement space.</p>
                        </div>
                        {/* Step 4 */}
                        <div className="card-concrete" style={{ padding: '40px 24px', borderRadius: '16px', backgroundColor: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                            <div style={{ width: '60px', height: '60px', margin: '0 auto 24px', backgroundColor: 'rgba(232,93,4,0.1)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 0 20px rgba(232,93,4,0.2)' }}>
                                🚀
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px', color: '#fff' }}>Step 4: Go Live</h3>
                            <p style={{ color: '#BBBBBB', fontSize: '0.9rem', lineHeight: '1.6' }}>Upload your creatives and watch your advertisement dominate the streets.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4.5: PREMIUM PLACEMENTS */}
            <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 className="section-title" style={{ fontSize: '2.5rem', margin: '0 0 16px 0' }}>Premium Placements</h2>
                    <p style={{ color: '#BBBBBB', fontSize: '1.1rem' }}>High-impact spaces for maximum brand visibility</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>

                    {/* Premium LED Wall */}
                    <div className="card-concrete" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.3s', cursor: 'pointer' }}>
                        <div style={{ height: '200px', backgroundColor: '#000', position: 'relative' }}>
                            <img src="/assets/hero_led_billboard.png" alt="LED Video Walls" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,13,1), transparent)' }}></div>
                        </div>
                        <div style={{ padding: '0 32px 32px 32px', flex: 1, position: 'relative', zIndex: 2 }}>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#fff', marginBottom: '12px' }}>Premium LED Wall</h3>
                            <p style={{ color: '#ccc', fontSize: '1rem', margin: 0, lineHeight: 1.6 }}>Dominate the skyline with ultra-bright, dynamic digital displays guaranteed to capture attention day and night in the city's busiest areas.</p>
                        </div>
                    </div>

                    {/* High Traffic Location */}
                    <div className="group" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ position: 'relative', width: '100%', height: '280px', overflow: 'hidden' }}>
                            <img src="/assets/premium_traffic_location.png" alt="High Traffic Location" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="group-hover:scale-105" />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--card-bg) 0%, rgba(30,30,46,0) 40%)', zIndex: 1 }}></div>
                        </div>
                        <div style={{ padding: '0 32px 32px 32px', flex: 1, position: 'relative', zIndex: 2 }}>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#fff', marginBottom: '12px' }}>High Traffic Location</h3>
                            <p style={{ color: '#ccc', fontSize: '1rem', margin: 0, lineHeight: 1.6 }}>Strategically positioned on premium city roads and massive intersections to maximize your brand's daily impressions and urban reach.</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* SECTION 5: EXPLORE BY CATEGORY */}
            <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 className="section-title" style={{ fontSize: '2.5rem', margin: '0 0 16px 0' }}>Explore Ad Formats</h2>
                    <p style={{ color: '#BBBBBB', fontSize: '1.1rem' }}>Find the perfect advertising medium for your brand</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                    {[
                        { title: 'LED Video Walls', image: '/assets/format_led_video.png', description: 'Dynamic, high-brightness digital displays' },
                        { title: 'Static Painted Walls', image: '/assets/format_static_wall.png', description: 'Traditional, long-lasting brand murals' },
                        { title: 'Flex Banners', image: '/assets/format_flex_banner.png', description: 'Cost-effective, large format print ads' },
                        { title: 'Transit Displays', image: '/assets/format_transit_display.png', description: 'Bus shelters and metro station branding' }
                    ].map((cat, idx) => (
                        <div key={idx} className="group" style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '300px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <img src={cat.image} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="group-hover:scale-110" />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)' }}></div>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>{cat.title}</h3>
                                <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>{cat.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 6: CITY COVERAGE */}
            <section style={{ backgroundColor: '#1A1A2E', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '80px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', gap: '20px' }}>
                        <div>
                            <h2 className="section-title" style={{ fontSize: '2.5rem', margin: '0 0 16px 0', textAlign: 'left' }}>Top Locations</h2>
                            <p style={{ color: '#BBBBBB', fontSize: '1.1rem', margin: 0 }}>Dominate the skyline in India's fastest growing cities</p>
                        </div>
                        <Link to="/cities" className="btn btn-outline" style={{ padding: '12px 24px' }}>View All Cities</Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        {[
                            { city: 'Mumbai', image: '/assets/city_mumbai.png', properties: '120+ Spaces' },
                            { city: 'Delhi NCR', image: '/assets/city_delhi.png', properties: '150+ Spaces' },
                            { city: 'Bangalore', image: '/assets/city_bangalore.png', properties: '90+ Spaces' },
                            { city: 'Hyderabad', image: '/assets/city_hyderabad.png', properties: '85+ Spaces' }
                        ].map((loc, idx) => (
                            <div key={idx} className="group" style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '200px', cursor: 'pointer' }}>
                                <img src={loc.image} alt={loc.city} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="group-hover:scale-110" />
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', transition: 'background 0.3s' }} className="group-hover:bg-black/20"></div>
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <h3 style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)', margin: '0 0 4px 0', letterSpacing: '1px' }}>{loc.city}</h3>
                                    <span style={{ background: 'var(--primary)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>{loc.properties}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 7: BEFORE & AFTER VISUALIZER */}
            <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 className="section-title" style={{ fontSize: '2.5rem', margin: '0 0 16px 0' }}>The Power of Outdoor</h2>
                    <p style={{ color: '#BBBBBB', fontSize: '1.1rem' }}>Transforming empty spaces into high-impact revenue generators</p>
                </div>
                <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', backgroundColor: '#1A1A2E', display: 'flex', justifyContent: 'center' }}>
                    <img src="/assets/before_after_combined.jpg" alt="Before and After Comparison" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                </div>
            </section>

            {/* SECTION 8: BRAND SHOWCASE */}
            <section style={{ backgroundColor: '#13151a', borderTop: '1px solid rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.02)', padding: '60px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <p style={{ color: '#888', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '32px' }}>Trusted by top brands</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '40px', opacity: 0.6 }}>
                        <h2 style={{ margin: 0, fontSize: '2rem', fontFamily: 'serif', fontStyle: 'italic', fontWeight: 'bold' }}>SamSong</h2>
                        <h2 style={{ margin: 0, fontSize: '2rem', fontFamily: 'sans-serif', fontWeight: '900', letterSpacing: '-1px' }}>Naike</h2>
                        <h2 style={{ margin: 0, fontSize: '2rem', fontFamily: 'sans-serif', fontWeight: 'bold' }}>Amaezon <span style={{ color: '#FF9900' }}>→</span></h2>
                        <h2 style={{ margin: 0, fontSize: '2rem', fontFamily: 'sans-serif', fontWeight: '900', color: '#E50914', textTransform: 'uppercase', letterSpacing: '1px' }}>Netflux</h2>
                        <h2 style={{ margin: 0, fontSize: '2rem', fontFamily: 'sans-serif', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#1DB954', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2px' }}>
                                <div style={{ width: '12px', height: '2px', background: '#000', borderRadius: '2px' }}></div>
                                <div style={{ width: '8px', height: '2px', background: '#000', borderRadius: '2px' }}></div>
                            </div>
                            Spottyfie
                        </h2>
                    </div>
                </div>
            </section>

            {/* SECTION 9: FINAL CTA */}
            <section style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                <h2 style={{ fontSize: '3.5rem', fontWeight: '900', margin: '0 0 24px 0', lineHeight: 1.1 }}>Ready to dominate<br /><span className="text-gradient">the streets?</span></h2>
                <p style={{ color: '#BBBBBB', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '40px' }}>Join India's fastest growing outdoor advertising network today.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
                    <button onClick={scrollToSpaces} className="btn btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.2rem', fontWeight: 'bold', boxShadow: '0 0 20px rgba(232,93,4,0.4)' }}>Find a Space</button>
                    <Link to={user ? `/dashboard/${user.role}` : '/register'} className="btn btn-outline" style={{ padding: '1.2rem 2.5rem', fontSize: '1.2rem', fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>List Your Wall</Link>
                </div>
            </section>

            {/* SIMPLE FOOTER */}
            <footer className="text-center py-8 border-t border-gray-800 mt-12 bg-[#0a0a0f] relative z-10">
                <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap" rel="stylesheet" />
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 font-medium mb-4">
                    <span style={{ fontFamily: '"Caveat", cursive', fontSize: '1.8rem', color: '#ffbd00', transform: 'rotate(-2deg)', display: 'inline-block' }} className="hover:text-white transition-colors title-glow">Made by team SARR</span>
                </div>
                <div className="text-xs text-gray-600">
                    &copy; 2026 DWMS - Digital Wall Management System. All rights reserved.
                </div>
            </footer>
        </div>
    );

};

export default Home;
