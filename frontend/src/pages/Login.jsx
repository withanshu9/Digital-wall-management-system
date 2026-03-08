import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../utils/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // UI states
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Load remembered email
        const rememberedEmail = localStorage.getItem('dwms_remembered_email');
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (rememberMe) {
            localStorage.setItem('dwms_remembered_email', email);
        } else {
            localStorage.removeItem('dwms_remembered_email');
        }

        const result = await login(email, password);
        if (result.success) {
            navigate(`/dashboard/${result.role}`);
        } else {
            setError(result.error);
        }
        setIsLoading(false);
    };

    const handleDemoLogin = (roleEmail) => {
        setEmail(roleEmail);
        setPassword('password123');
    };

    return (
        <div className="login-container">
            {/* Left Side (60%) */}
            <div className="login-left">
                <div className="login-left-bg"></div>
                <div className="login-left-overlay"></div>

                <div className="login-left-content">
                    <h1 className="login-headline">
                        Turn Walls Into <br />
                        <span className="login-headline-gradient">Revenue.</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#9ca3af', marginBottom: '3rem', maxWidth: '500px', lineHeight: '1.6' }}>
                        Connect wall owners and advertisers in one seamless platform. Manage inventory, view analytics, and secure bookings effortlessly.
                    </p>

                    <div className="login-stats">
                        <div>
                            <h3 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 4px 0', color: 'white' }}>100+</h3>
                            <p style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', margin: 0 }}>Active Brands</p>
                        </div>
                        <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                        <div>
                            <h3 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 4px 0', color: 'white' }}>500+</h3>
                            <p style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', margin: 0 }}>Premium Spaces</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side (40%) */}
            <div className="login-right animate-fade-in">
                <div className="login-card">

                    <div style={{ marginBottom: '2rem' }}>
                        <span className="login-pill">DWMS</span>
                        <h2 style={{ fontSize: '1.875rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: 'white' }}>Welcome Back</h2>
                        <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.875rem' }}>Sign in to access your dashboard.</p>
                    </div>

                    {/* Segmented Control for Fast Access */}
                    <div className="segmented-control">
                        {['advertiser', 'owner', 'admin'].map((role) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => handleDemoLogin(`${role}@test.com`)}
                                className={`segmented-btn ${email === `${role}@test.com` ? 'active' : ''}`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="error-msg">
                            <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div className="input-block">
                            <label className="input-label">Email Address</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                </div>
                                <input
                                    type="email"
                                    className="login-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="input-block">
                            <div className="input-label-row">
                                <label className="input-label" style={{ marginBottom: 0 }}>Password</label>
                                <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
                            </div>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="login-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    tabIndex="-1"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                                    ) : (
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                    )}
                                </button>
                            </div>

                            <div className="remember-row">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="remember-checkbox"
                                />
                                <label htmlFor="rememberMe" className="remember-label">Remember me</label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <svg style={{ animation: 'spin 1s linear infinite', marginLeft: '-0.25rem', marginRight: '0.75rem', height: '1.25rem', width: '1.25rem', color: 'white' }} fill="none" viewBox="0 0 24 24"><circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <div>
                        <div className="login-divider">
                            <span>or</span>
                        </div>

                        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af', margin: 0 }}>
                            Don't have an account? <Link to="/register" style={{ fontWeight: 600, color: 'white', marginLeft: '4px' }}>Create one now</Link>
                        </p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .login-container { display: flex; min-height: 100vh; background-color: #0a0a0b; color: white; font-family: 'Inter', sans-serif; }
                .login-left { display: none; flex: 0 0 60%; position: relative; overflow: hidden; align-items: center; justify-content: center; padding: 4rem; }
                @media (min-width: 1024px) { .login-left { display: flex; } }
                .login-left-bg { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url('https://images.unsplash.com/photo-1542204637-e67bc7d41e48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'); background-size: cover; background-position: center; opacity: 0.3; mix-blend-mode: overlay; }
                .login-left-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, #0a0a0b 10%, rgba(10, 10, 11, 0.8) 60%, transparent); }
                .login-left-content { position: relative; z-index: 10; max-width: 600px; width: 100%; }
                .login-headline { font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 1.5rem; font-family: 'Outfit', sans-serif; letter-spacing: -1px; }
                @media (min-width: 1280px) { .login-headline { font-size: 4.5rem; } }
                .login-headline-gradient { background: linear-gradient(90deg, #60a5fa, #818cf8); -webkit-background-clip: text; background-clip: text; color: transparent; }
                .login-stats { display: flex; gap: 2rem; margin-top: 3rem; }
                .login-right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem; position: relative; }
                .login-card { width: 100%; max-width: 440px; background-color: #131316; border-radius: 16px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.05); padding: 2.5rem; position: relative; z-index: 10; }
                .login-pill { display: inline-block; padding: 4px 12px; border-radius: 20px; background-color: rgba(59, 130, 246, 0.1); color: #60a5fa; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1rem; border: 1px solid rgba(59, 130, 246, 0.2); }
                .segmented-control { display: flex; background: #0a0a0b; border-radius: 10px; padding: 4px; border: 1px solid rgba(255, 255, 255, 0.05); margin-bottom: 2rem; }
                .segmented-btn { flex: 1; background: transparent; border: 1px solid transparent; color: #6b7280; padding: 8px 0; border-radius: 8px; font-size: 0.75rem; font-weight: 600; text-transform: capitalize; transition: all 0.2s; cursor: pointer; }
                .segmented-btn.active { background: #1d1d24; color: white; border-color: rgba(255, 255, 255, 0.1); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); }
                .segmented-btn:not(.active):hover { color: #d1d5db; }
                .input-block { margin-bottom: 1.5rem; }
                .input-label { display: block; font-size: 0.875rem; font-weight: 500; color: #d1d5db; margin-bottom: 0.5rem; }
                .input-label-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0.5rem; }
                .forgot-link { font-size: 0.75rem; color: #60a5fa; text-decoration: none; font-weight: 500; transition: color 0.2s; }
                .forgot-link:hover { color: #93c5fd; }
                .input-wrapper { position: relative; display: flex; align-items: center; }
                .input-icon { position: absolute; left: 14px; color: #6b7280; display: flex; pointer-events: none; }
                .input-icon svg { width: 20px; height: 20px; }
                .password-toggle { position: absolute; right: 14px; color: #6b7280; display: flex; cursor: pointer; background: transparent; border: none; transition: color 0.2s; }
                .password-toggle:hover { color: #d1d5db; }
                .password-toggle svg { width: 20px; height: 20px; }
                .login-input { width: 100%; height: 48px; background-color: #0a0a0b; border: 1px solid #27272a; border-radius: 10px; padding-left: 42px; padding-right: 42px; color: white; font-size: 0.9rem; transition: all 0.2s; font-family: inherit; }
                .login-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); }
                .remember-row { display: flex; align-items: center; margin-top: 1rem; margin-bottom: 0.5rem; }
                .remember-checkbox { width: 16px; height: 16px; margin-right: 8px; cursor: pointer; background-color: #0a0a0b; border: 1px solid #27272a; border-radius: 4px; }
                .remember-label { font-size: 0.8rem; color: #9ca3af; cursor: pointer; }
                .login-btn { width: 100%; height: 48px; background: linear-gradient(to right, #2563eb, #4f46e5); color: white; font-weight: 600; border: none; border-radius: 10px; margin-top: 1.5rem; transition: all 0.2s; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3); cursor: pointer; display: flex; align-items: center; justify-content: center; }
                .login-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4); }
                .login-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
                .login-divider { display: flex; align-items: center; margin: 2rem 0 1.5rem; color: #6b7280; font-size: 0.8rem; }
                .login-divider::before, .login-divider::after { content: ""; flex: 1; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
                .login-divider span { padding: 0 10px; }
                .error-msg { background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #f87171; padding: 12px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 8px; }
                .error-msg svg { width: 18px; height: 18px; flex-shrink: 0; }
            `}} />
        </div>
    );
};

export default Login;
