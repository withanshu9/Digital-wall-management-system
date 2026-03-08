import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError("Passwords do not match.");
        }
        if (password.length < 6) {
            return setError("Password must be at least 6 characters long.");
        }

        setIsLoading(true);
        setError('');
        setStatus('');

        try {
            const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
                newPassword: password
            });
            setStatus(res.data.message);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired token.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 120px)' }}>
            <div className="card-concrete animate-fade-in w-full max-w-md p-8">
                <h2 className="text-center mb-2 text-2xl font-bold">Reset Password</h2>
                <p className="text-center text-muted mb-6 text-sm">Please enter a new password for your account.</p>

                {status && (
                    <div className="mb-6 p-4 bg-success text-dark font-bold rounded text-center text-sm">
                        {status}
                        <p className="mt-2 text-xs font-normal">Redirecting to login...</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-danger text-white rounded text-center text-sm">
                        {error}
                    </div>
                )}

                {!status && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-4 relative">
                            <label className="form-label text-sm text-gray-300">New Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9 text-muted hover:text-white"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        <div className="form-group mb-6">
                            <label className="form-label text-sm text-gray-300">Confirm New Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full py-3 mb-4"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating Password...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                {error && (
                    <p className="text-center text-sm text-muted mt-4">
                        Token expired? <Link to="/forgot-password" className="text-accent hover:underline">Request a new one</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
