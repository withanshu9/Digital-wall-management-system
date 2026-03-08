import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WallCard from '../components/WallCard';

const topCities = [
    { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'Delhi NCR', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'Hyderabad', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'Chennai', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'Pune', image: 'https://images.unsplash.com/photo-1572013898687-0b1aeb13c4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

const Cities = () => {
    const [activeCity, setActiveCity] = useState(topCities[0].name);
    const [walls, setWalls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchWalls = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/walls');
                if (response.data.success) {
                    setWalls(response.data.data);
                } else {
                    setWalls(response.data || []);
                }
            } catch (error) {
                console.error("Error fetching walls:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWalls();
    }, []);

    const filteredWalls = walls.filter(wall => wall.city && wall.city.toLowerCase().includes(activeCity.toLowerCase()));

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#0a0a0f' }}>
            {/* Header */}
            <header style={{ padding: '60px 24px', textAlign: 'center', background: 'linear-gradient(to bottom, #1a1a2e, #0a0a0f)' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '900', margin: '0 0 16px 0', color: '#fff' }}>Discover Spaces by City</h1>
                <p style={{ color: '#BBBBBB', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Browse our exclusive inventory of advertising spaces in premium locations across India.</p>
            </header>

            {/* City Tabs */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'flex', overflowX: 'auto', gap: '16px', paddingBottom: '20px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                    {topCities.map((city, idx) => (
                        <div
                            key={idx}
                            onClick={() => setActiveCity(city.name)}
                            style={{
                                flexShrink: 0,
                                width: '200px',
                                height: '120px',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                position: 'relative',
                                cursor: 'pointer',
                                border: activeCity === city.name ? '3px solid #FFD60A' : '1px solid rgba(255,255,255,0.1)',
                                transition: 'all 0.3s'
                            }}
                        >
                            <img src={city.image} alt={city.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: activeCity === city.name ? 1 : 0.6, transition: '0.3s' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', transition: '0.3s' }} className={activeCity === city.name ? '' : 'hover:bg-black/20'}></div>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: 'bold', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{city.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px 24px' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', color: '#fff' }}>Spaces in {activeCity}</h2>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <div style={{ width: '50px', height: '50px', border: '4px solid rgba(255,214,10,0.3)', borderTopColor: '#e85d04', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                        <p style={{ marginTop: '20px', color: '#BBBBBB' }}>Loading spaces...</p>
                    </div>
                ) : filteredWalls.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
                        {filteredWalls.map(wall => (
                            <WallCard key={wall._id} wall={wall} />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '120px 20px', backgroundColor: 'rgba(30, 30, 46, 0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h2 style={{ fontSize: '4rem', fontWeight: '900', color: '#888', margin: '0 0 24px 0', opacity: 0.5 }}>Unfortunately,<br />unavailable</h2>
                        <p style={{ color: '#BBBBBB', fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto' }}>We currently do not have any listed ad spaces heavily populating {activeCity}. Please check back later or explore other major cities above.</p>
                    </div>
                )}
            </div>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Cities;
