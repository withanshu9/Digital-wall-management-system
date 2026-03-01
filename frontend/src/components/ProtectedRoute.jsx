import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../utils/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, token } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
