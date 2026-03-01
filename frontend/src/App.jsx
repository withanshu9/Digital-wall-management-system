import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WallDetail from './pages/WallDetail';
import AdvertiserDashboard from './pages/AdvertiserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/wall/:id" element={<WallDetail />} />

                        <Route element={<ProtectedRoute allowedRoles={['advertiser']} />}>
                            <Route path="/dashboard/advertiser" element={<AdvertiserDashboard />} />
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
                            <Route path="/dashboard/owner" element={<OwnerDashboard />} />
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                            <Route path="/dashboard/admin" element={<AdminDashboard />} />
                        </Route>
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
