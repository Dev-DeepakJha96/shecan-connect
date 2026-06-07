import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatsCard from '../../components/admin/StatsCard';
import { API_BASE_URL } from '../../services/config.js';
import { 
  FiUsers, 
  FiClock, 
  FiCheckCircle, 
  FiDollarSign,
  FiUser,
  FiMail,
  FiCalendar,
  FiTrendingUp,
  FiHeart,
  FiTarget,
  FiAlertCircle
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentVolunteers, setRecentVolunteers] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [donationStats, setDonationStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = API_BASE_URL;
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await fetch(`${API_URL}/api/v1/admin/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.data);

      const volunteersRes = await fetch(`${API_URL}/api/v1/admin/volunteers?limit=5`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const volunteersData = await volunteersRes.json();
      if (volunteersData.success) setRecentVolunteers(volunteersData.data);

      const donationsRes = await fetch(`${API_URL}/api/v1/donation/admin/donations?status=completed&limit=5`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const donationsData = await donationsRes.json();
      if (donationsData.success) {
        setRecentDonations(donationsData.data);
        setDonationStats(donationsData.summary);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPurposeIcon = (purpose) => {
    switch(purpose) {
      case 'education':
        return <FiTrendingUp className="inline mr-1" size={14} />;
      case 'healthcare':
        return <FiHeart className="inline mr-1" size={14} />;
      case 'food':
        return <FiTarget className="inline mr-1" size={14} />;
      case 'emergency':
        return <FiAlertCircle className="inline mr-1" size={14} />;
      default:
        return <FiDollarSign className="inline mr-1" size={14} />;
    }
  };

  const getPurposeLabel = (purpose) => {
    const labels = {
      general: 'General',
      education: 'Education',
      healthcare: 'Healthcare',
      food: 'Food',
      emergency: 'Emergency'
    };
    return labels[purpose] || purpose;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
        
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total Volunteers" 
            value={stats?.totalVolunteers || 0} 
            icon={<FiUsers size={24} />} 
            color="pink" 
          />
          <StatsCard 
            title="Pending Applications" 
            value={stats?.pendingVolunteers || 0} 
            icon={<FiClock size={24} />} 
            color="yellow" 
          />
          <StatsCard 
            title="Approved Volunteers" 
            value={stats?.approvedVolunteers || 0} 
            icon={<FiCheckCircle size={24} />} 
            color="green" 
          />
          <StatsCard 
            title="Total Donations" 
            value={donationStats?.totalDonations || 0} 
            icon={<FiDollarSign size={24} />} 
            color="blue" 
          />
        </div>

        {donationStats && donationStats.totalAmount > 0 && (
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow mb-8 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-pink-100 text-sm">Total Donations Received</p>
                <p className="text-3xl font-bold">₹{donationStats.totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <FiDollarSign size={32} />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Recent Volunteer Applications</h2>
              <button 
                onClick={() => window.location.href = '/admin/volunteers'}
                className="text-pink-600 hover:text-pink-700 text-sm font-medium"
              >
                View All →
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiUser size={14} /> Name
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiMail size={14} /> Email
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiCalendar size={14} /> Applied On
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentVolunteers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No volunteer applications yet
                    </td>
                  </tr>
                ) : (
                  recentVolunteers.map((volunteer) => (
                    <tr key={volunteer._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{volunteer.fullName}</div>
                          <div className="text-sm text-gray-500">{volunteer.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{volunteer.email}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(volunteer.appliedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(volunteer.status)}`}>
                          {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Recent Donations</h2>
              <button 
                onClick={() => window.location.href = '/admin/donations'}
                className="text-pink-600 hover:text-pink-700 text-sm font-medium"
              >
                View All →
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiUser size={14} /> Donor
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiCalendar size={14} /> Date
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentDonations.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No completed donations yet
                    </td>
                  </tr>
                ) : (
                  recentDonations.map((donation) => (
                    <tr key={donation._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{donation.donorName}</div>
                          <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-green-600">₹{donation.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize flex items-center gap-1 text-gray-600">
                          {getPurposeIcon(donation.purpose)}
                          {getPurposeLabel(donation.purpose)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(donation.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
