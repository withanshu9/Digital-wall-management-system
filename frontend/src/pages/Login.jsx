import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../utils/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await login(email, password);
        if (result.success) {
            navigate(`/dashboard/${result.role}`);
        } else {
            setError(result.error);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
            <div className="card-concrete animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <h2 className="text-center mb-4 text-gradient">Login to DWMS</h2>

                {error && <div className="mb-3 p-3 bg-danger text-white rounded" style={{ fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-center mt-4 text-muted" style={{ fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/register" className="text-accent">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
