import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultWallImg from '../assets/images/default-wall.png';

const WallCard = ({ wall }) => {
    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);

    // Normalize availability
    const isAvailable = wall.availability === 'available' || wall.availability_badge === 'Available' || (!wall.availability && !wall.availability_badge);
    const badgeText = isAvailable ? 'AVAILABLE' : 'BOOKED';
    const badgeColor = isAvailable ? '#10b981' : '#ef4444'; // Green vs Red

    return (
        <div
            className="card-concrete animate-fade-in group"
            style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', width: '100%' }}
            onClick={() => navigate(`/wall/${wall._id}`)}
        >
            {/* Image Section (Top) */}
            <div style={{ position: 'relative', width: '100%', height: '240px', flexShrink: 0 }}>
                <img
                    src={wall.images?.[0] || defaultWallImg}
                    alt={wall.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    className="rounded-t-lg"
                    onError={(e) => { e.target.onerror = null; e.target.src = defaultWallImg; }}
                />

                {/* Image Gradient Blur at Bottom */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
                    background: 'linear-gradient(to bottom, transparent, var(--bg-card))',
                    pointerEvents: 'none'
                }}></div>

                {/* Availability Badge */}
                <div style={{
                    position: 'absolute', top: '16px', left: '16px',
                    background: badgeColor,
                    padding: '6px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '800',
                    color: 'white', letterSpacing: '0.5px', boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
                }}>
                    {badgeText}
                </div>
            </div>

            {/* Content Section (Bottom) */}
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, position: 'relative', padding: '24px' }}>

                {/* Heart/Save Icon */}
                <button
                    style={{
                        position: 'absolute', top: '24px', right: '24px',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%',
                        width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', zIndex: 10, transition: 'all 0.2s'
                    }}
                    className="hover:bg-white group-hover:bg-white"
                    onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
                    title={saved ? "Unsave" : "Save"}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? '#E85D04' : 'none'} stroke={saved ? '#E85D04' : '#999'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>

                {/* Title & Format */}
                <div style={{ paddingRight: '48px', marginBottom: '12px' }}>
                    <h3 className="text-white" style={{ fontSize: '1.4rem', fontWeight: '800', lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingBottom: '4px' }} title={wall.title}>
                        {wall.title}
                    </h3>
                    {wall.type && (
                        <div className="text-muted" style={{ fontSize: '0.75rem', fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.8 }}>
                            {wall.type}
                        </div>
                    )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-muted text-sm mb-6">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span className="truncate">{wall.location}, {wall.city}</span>
                </div>

                {/* Specs Block Inline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', marginTop: 'auto', backgroundColor: 'rgba(26,26,46,0.4)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex justify-between items-center" style={{ fontSize: '0.875rem' }}>
                        <span className="text-muted" style={{ fontWeight: '500', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Dimensions:</span>
                        <span style={{ color: '#e5e7eb', fontWeight: '600' }}>{wall.width} × {wall.height} ft</span>
                    </div>
                    <div className="flex justify-between items-center" style={{ fontSize: '0.875rem' }}>
                        <span className="text-muted" style={{ fontWeight: '500', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Daily Traffic:</span>
                        <span style={{ color: '#e5e7eb', fontWeight: '600' }}>{(wall.trafficEstimate || 0).toLocaleString()} views</span>
                    </div>
                </div>

                {/* Price Row (Centered/Balanced above button) */}
                <div className="text-center" style={{ marginBottom: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                    <div className="text-accent flex items-center justify-center gap-1" style={{ fontWeight: 'bold', lineHeight: '1' }}>
                        <span style={{ fontSize: '26px' }}>₹{wall.basePrice?.toLocaleString() || '0'}</span>
                        <span className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 'normal', textTransform: 'lowercase', letterSpacing: '0.05em', opacity: 0.8, marginTop: '4px' }}>
                            / {wall.pricingType?.replace('per ', '') || 'month'}
                        </span>
                    </div>
                </div>

                {/* Full Width Action Button */}
                <button
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '6px', fontWeight: '700', letterSpacing: '0.5px' }}
                    onClick={(e) => { e.stopPropagation(); navigate(`/wall/${wall._id}`); }}
                >
                    Book Now
                </button>
            </div>
        </div>
    );
};

export default WallCard;
