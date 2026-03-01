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
            backgroundColor: 'rgba(15, 17, 21, 0.9)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            height: '80px', display: 'flex', alignItems: 'center'
        }}>
            <div className="main-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 0, paddingBottom: 0 }}>

                <Link to="/" className="logo flex items-center gap-2">
                    <img src="/src/assets/images/favicon.png" alt="DWMS Logo" style={{ width: '40px', height: '40px', borderRadius: '4px' }} />
                    <h1 className="text-primary" style={{ fontSize: '1.5rem', margin: 0 }}>DWMS</h1>
                </Link>

                <nav className="nav-links flex items-center gap-4">
                    <Link to="/" className="text-muted hover:text-white" style={{ transition: 'color 0.3s' }}>Marketplace</Link>

                    {user ? (
                        <>
                            <Link
                                to={`/dashboard/${user.role}`}
                                className="text-muted hover:text-white"
                                style={{ transition: 'color 0.3s' }}
                            >
                                Dashboard
                            </Link>
                            <div className="user-menu flex items-center gap-4 ml-4 pl-4" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                                <span className="text-sm font-medium">Hello, <span className="text-accent">{user.name}</span></span>
                                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons flex gap-2 ml-4">
                            <Link to="/login" className="btn btn-outline">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
