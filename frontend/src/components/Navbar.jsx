import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../utils/useAuth';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/login');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const isActive = (path) => location.pathname === path;

    return (
        <header className="navbar-header">
            <div className="navbar-inner">
                {/* ---------------------------------------------------------------- */}
                {/* LEFT SECTION: Logo & Nav Links                                */}
                {/* ---------------------------------------------------------------- */}
                <div className="navbar-left">
                    {/* Logo */}
                    <Link to="/" onClick={closeMenu} className="navbar-logo">
                        <img src="/src/assets/images/favicon.png" alt="DWMS Logo" />
                        <h1>DWMS</h1>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="navbar-nav">
                        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
                        <Link to="/cities" className={`nav-link ${isActive('/cities') ? 'active' : ''}`}>Explore Walls</Link>
                        <a href="/#how-it-works" className="nav-link">Pricing</a>
                        <a href="/#how-it-works" className="nav-link">About</a>
                        <a href="/#contact" className="nav-link">Contact</a>
                    </nav>
                </div>

                {/* ---------------------------------------------------------------- */}
                {/* RIGHT SECTION: CTA & Profile                                    */}
                {/* ---------------------------------------------------------------- */}
                <div className="navbar-right">
                    {/* Primary CTA (List Space) */}
                    {(!user || user.role !== 'advertiser') && (
                        <Link to={user ? `/dashboard/${user.role}` : '/register'} className="cta-button">
                            List Your Space
                        </Link>
                    )}

                    {user ? (
                        <div className="profile-container">
                            {/* Profile Dropdown Area */}
                            <div className="profile-trigger">
                                <div className="profile-avatar">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="profile-name">{user.email}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#888' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>

                            {/* Dropdown Menu Content */}
                            <div className="profile-dropdown">
                                <div className="dropdown-header">
                                    <h4>{user.name}</h4>
                                    <p>{user.role} Account</p>
                                </div>

                                <Link to={`/dashboard/${user.role}`} className="dropdown-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                    My Dashboard
                                </Link>

                                {user.role === 'owner' && (
                                    <Link to="/dashboard/owner" className="dropdown-item">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                        My Listings
                                    </Link>
                                )}

                                <button onClick={handleLogout} className="dropdown-item logout">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="auth-links">
                            <Link to="/login" className="login-link">Log In</Link>
                            <Link to="/register" className="cta-button">Get Started</Link>
                        </div>
                    )}
                </div>

                {/* MOBILE MENU TOGGLE */}
                <button className="mobile-toggle" onClick={toggleMenu}>
                    {isMenuOpen ? (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    ) : (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    )}
                </button>

                {/* Mobile Dropdown */}
                <nav className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                    <Link to="/" onClick={closeMenu} className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
                    <Link to="/cities" onClick={closeMenu} className={`mobile-nav-link ${isActive('/cities') ? 'active' : ''}`}>Explore Walls</Link>
                    <a href="/#how-it-works" onClick={closeMenu} className="mobile-nav-link">Pricing</a>
                    <a href="/#how-it-works" onClick={closeMenu} className="mobile-nav-link">About</a>
                    <a href="/#contact" onClick={closeMenu} className="mobile-nav-link">Contact</a>

                    <div className="mobile-actions">
                        {user ? (
                            <>
                                <div className="mobile-profile">
                                    <div className="profile-avatar" style={{ width: '48px', height: '48px' }}>
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div className="mobile-profile-details">
                                        <h4>{user.name}</h4>
                                        <p>{user.email}</p>
                                    </div>
                                </div>

                                <Link to={`/dashboard/${user.role}`} onClick={closeMenu} className="mobile-btn mobile-btn-outline">
                                    My Dashboard
                                </Link>
                                <button onClick={handleLogout} className="mobile-btn mobile-btn-danger">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={closeMenu} className="mobile-btn mobile-btn-outline">Log In</Link>
                                <Link to="/register" onClick={closeMenu} className="mobile-btn mobile-btn-primary">Get Started</Link>
                            </>
                        )}
                        {(!user || user.role !== 'advertiser') && (
                            <Link to={user ? `/dashboard/${user.role}` : '/register'} onClick={closeMenu} className="mobile-btn mobile-btn-primary" style={{ marginTop: '8px' }}>
                                List Your Space
                            </Link>
                        )}
                    </div>
                </nav>

            </div>
        </header>
    );
};

export default Navbar;
