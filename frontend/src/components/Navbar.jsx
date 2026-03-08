import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../utils/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="navbar" style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            backgroundColor: 'rgba(13, 13, 13, 0.9)', /* Deep Dark Navy / Dark Bg */
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            height: '80px', display: 'flex', alignItems: 'center'
        }}>
            <div className="main-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 0, paddingBottom: 0 }}>

                <Link to="/" className="logo flex items-center gap-3" style={{ textDecoration: 'none' }}>
                    <img src="/src/assets/images/favicon.png" alt="DWMS Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                    <h1 className="text-primary" style={{ fontSize: '1.8rem', margin: 0, letterSpacing: '-0.5px', fontWeight: '800' }}>DWMS</h1>
                </Link>

                <nav className="nav-links flex items-center gap-4">
                    <Link to="/" className="text-muted hover:text-white" style={{ transition: 'color 0.3s', fontWeight: 500 }}>Browse Spaces</Link>

                    {!user && (
                        <a href="#how-it-works" className="text-muted hover:text-white" style={{ transition: 'color 0.3s', fontWeight: 500 }}>How It Works</a>
                    )}

                    {(!user || user.role !== 'advertiser') && (
                        <Link to={user ? `/dashboard/${user.role}` : '/register'} className="text-muted hover:text-white" style={{ transition: 'color 0.3s', fontWeight: 500 }}>
                            List Your Space
                        </Link>
                    )}

                    {user ? (
                        <>
                            <Link
                                to={`/dashboard/${user.role}`}
                                className="text-accent hover:text-white"
                                style={{ transition: 'color 0.3s', fontWeight: 600 }}
                            >
                                {user.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
                            </Link>
                            <div className="user-menu flex items-center gap-4 ml-4 pl-4" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                                <div
                                    className="flex items-center justify-center font-bold text-white shadow-sm"
                                    style={{
                                        width: '36px', height: '36px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--accent)',
                                        fontSize: '16px',
                                        border: '2px solid rgba(255,255,255,0.1)',
                                        textTransform: 'uppercase'
                                    }}
                                    title={user.name}
                                >
                                    {user.name ? user.name.charAt(0) : 'U'}
                                </div>
                                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', minHeight: '36px' }}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons flex gap-2 ml-4">
                            <Link to="/login" className="btn btn-outline" style={{ minHeight: '36px', padding: '0.5rem 1.25rem' }}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ minHeight: '36px', padding: '0.5rem 1.25rem' }}>Sign Up</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
