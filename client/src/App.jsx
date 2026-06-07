

import { BrowserRouter, Routes, Route , Navigate} from 'react-router-dom';
import Home from './pages/Home.jsx';
import VolunteerForm from "./pages/volunteer"; 
import AdminLogin from './pages/admin/Login.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import Volunteers from './pages/admin/Volunteers.jsx';
import VolunteerDetails from './pages/admin/VolunteerDetails.jsx';
import Donations from './pages/admin/Donations.jsx';
import ImpactMetrics from './pages/admin/ImpactMetrics.jsx';
import Profile from './pages/admin/Profile.jsx';
import TrackStatus from './pages/TrackStatus.jsx';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/volunteer-form" element={<VolunteerForm />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/volunteers" element={
          <ProtectedRoute><Volunteers /></ProtectedRoute>
        } />
        <Route path="/admin/volunteers/:id" element={
          <ProtectedRoute><VolunteerDetails /></ProtectedRoute>
        } />
        <Route path="/admin/donations" element={
          <ProtectedRoute><Donations /></ProtectedRoute>
        } />
        <Route path="/admin/impact-metrics" element={
          <ProtectedRoute><ImpactMetrics /></ProtectedRoute>
        } />
        <Route path="/admin/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path='/track-status' element={<TrackStatus />} />
        <Route path='/status/:trackingId' element={<TrackStatus />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;