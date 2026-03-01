import React from 'react';

const WallCard = ({ wall }) => {
    return (
        <div className="card-concrete animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
                <img
                    src={wall.images?.[0] || 'https://images.unsplash.com/photo-1542204637-e67bc7d41e48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={wall.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    className="hover:scale-105"
                />
                <div style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: 'var(--primary)', backdropFilter: 'blur(5px)',
                    padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800',
                    border: '1px solid rgba(255,255,255,0.1)', color: 'white'
                }}>
                    {wall.locationType || 'Strategic Location'}
                </div>
                <div style={{
                    position: 'absolute', top: '10px', left: '10px',
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
                    padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '500',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {wall.type}
                </div>
                {wall.availability === 'booked' && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(2px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--warning)', fontSize: '1.5rem', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase',
                        transform: 'rotate(-10deg)', textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                    }}>
                        Booked
                    </div>
                )}
            </div>

            <div className="p-4" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 className="mb-1" style={{ fontSize: '1.25rem' }}>{wall.title}</h3>
                <p className="text-muted mb-2 text-sm flex items-center gap-1">📍 {wall.city}, {wall.location}</p>

                <div className="grid grid-cols-2 gap-2 mb-3 mt-auto">
                    <div className="bg-dark p-2 rounded border border-gray-800" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                        <span className="text-xs text-muted block">Size</span>
                        <span className="font-semibold">{wall.width}×{wall.height} ft</span>
                    </div>
                    <div className="bg-dark p-2 rounded border border-gray-800" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                        <span className="text-xs text-muted block">Traffic (Daily)</span>
                        <span className="font-semibold">{(wall.trafficEstimate || 0).toLocaleString()}</span>
                        {wall.trafficLevel && <span className="block text-xs text-success mt-1">{wall.trafficLevel}</span>}
                    </div>
                </div>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-800" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div>
                        <span className="text-xs text-muted block">Price</span>
                        <span className="text-accent font-bold" style={{ fontSize: '1.2rem' }}>₹{wall.basePrice.toLocaleString()}</span>
                        <span className="text-xs text-muted ml-1">/ {wall.pricingType.replace('per ', '')}</span>
                    </div>
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>View Details</button>
                </div>
            </div>
        </div>
    );
};

export default WallCard;
