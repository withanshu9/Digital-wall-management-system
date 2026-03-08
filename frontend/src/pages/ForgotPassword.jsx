import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setStatus('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setStatus(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 120px)' }}>
            <div className="card-concrete animate-fade-in w-full max-w-md p-8">
                <h2 className="text-center mb-2 text-2xl font-bold">Forgot Password</h2>
                <p className="text-center text-muted mb-6 text-sm">Enter your email address and we'll send you a link to reset your password.</p>

                {status && (
                    <div className="mb-6 p-4 bg-success text-dark font-bold rounded text-center text-sm">
                        {status}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-danger text-white rounded text-center text-sm">
                        {error}
                    </div>
                )}

                {!status && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-6">
                            <label className="form-label text-sm text-gray-300">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-full py-3 mb-4"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                <p className="text-center text-sm text-muted mt-4">
                    Remember your password? <Link to="/login" className="text-accent hover:underline">Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
