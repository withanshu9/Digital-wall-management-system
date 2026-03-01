import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../utils/useAuth';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'advertiser'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await register(formData.name, formData.email, formData.password, formData.role);
        if (result.success) {
            navigate(`/dashboard/${result.role}`);
        } else {
            setError(result.error);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
            <div className="card-concrete animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}>
                <h2 className="text-center mb-4 text-gradient">Join DWMS Platform</h2>

                {error && <div className="mb-3 p-3 bg-danger text-white rounded" style={{ fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label">I want to:</label>
                        <select
                            name="role"
                            className="form-control"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="advertiser">Book Advertising Walls (Advertiser)</option>
                            <option value="owner">List My Walls for Rent (Owner)</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center mt-4 text-muted" style={{ fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" className="text-accent">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
