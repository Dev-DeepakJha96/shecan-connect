import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import StatsCard from '../../components/admin/StatsCard';
import { API_BASE_URL } from '../../services/config.js';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiHeart, 
  FiTarget,
  FiUser,
  FiMail,
  FiCalendar,
  FiFileText,
  FiSearch,
  FiFilter,
  FiDownload,
  FiAlertCircle,
  FiCheckCircle,
  FiTrash2,
  FiX
} from 'react-icons/fi';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const API_URL = API_BASE_URL;
  const token = localStorage.getItem('adminToken');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDonations();
  }, [filter, currentPage]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' 
        ? `${API_URL}/api/v1/donation/admin/donations?page=${currentPage}&limit=${itemsPerPage}`
        : `${API_URL}/api/v1/donation/admin/donations?status=${filter}&page=${currentPage}&limit=${itemsPerPage}`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setDonations(data.data);
        setStats(data.summary);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDonation = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/donation/admin/donations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchDonations();
        setDeleteConfirm(null);
      } else {
        alert('Failed to delete donation');
      }
    } catch (error) {
      console.error('Error deleting donation:', error);
      alert('Error deleting donation');
    }
  };

  const deleteAllPending = async () => {
    const pendingDonations = donations.filter(d => d.status === 'pending' || d.status === 'failed');
    if (pendingDonations.length === 0) {
      alert('No pending or failed donations to delete');
      return;
    }
    
    if (window.confirm(`Delete ${pendingDonations.length} pending/failed donations? This cannot be undone.`)) {
      for (const donation of pendingDonations) {
        await fetch(`${API_URL}/api/v1/donation/admin/donations/${donation._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      fetchDonations();
    }
  };

  const getPurposeIcon = (purpose) => {
    const icons = {
      general: <FiDollarSign size={16} className="inline mr-1" />,
      education: <FiTrendingUp size={16} className="inline mr-1" />,
      healthcare: <FiHeart size={16} className="inline mr-1" />,
      food: <FiTarget size={16} className="inline mr-1" />,
      emergency: <FiAlertCircle size={16} className="inline mr-1" />
    };
    return icons[purpose] || <FiDollarSign size={16} className="inline mr-1" />;
  };

  const getPurposeLabel = (purpose) => {
    const labels = {
      general: 'General Fund',
      education: 'Education',
      healthcare: 'Healthcare',
      food: 'Food Distribution',
      emergency: 'Emergency Relief'
    };
    return labels[purpose] || purpose;
  };

  const getPurposeColor = (purpose) => {
    const colors = {
      general: 'bg-blue-100 text-blue-700',
      education: 'bg-purple-100 text-purple-700',
      healthcare: 'bg-green-100 text-green-700',
      food: 'bg-orange-100 text-orange-700',
      emergency: 'bg-red-100 text-red-700'
    };
    return colors[purpose] || 'bg-gray-100 text-gray-700';
  };

  const filteredDonations = donations.filter(donation => 
    donation.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.donorEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingFailedCount = donations.filter(d => d.status === 'pending' || d.status === 'failed').length;

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Donations</h1>
            <p className="text-gray-500 mt-1">Track and manage all donations received</p>
          </div>
          
          <div className="flex gap-3">
            {pendingFailedCount > 0 && (
              <button 
                onClick={deleteAllPending}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FiTrash2 size={18} />
                Clear Pending/Failed ({pendingFailedCount})
              </button>
            )}
            
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <FiDownload size={18} />
              Export
            </button>
          </div>
        </div>

        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Total Donations" 
              value={stats.totalDonations || 0} 
              icon={<FiFileText size={24} />} 
              color="blue" 
            />
            <StatsCard 
              title="Total Amount" 
              value={`₹${(stats.totalAmount || 0).toLocaleString()}`} 
              icon={<FiDollarSign size={24} />} 
              color="green" 
            />
            <StatsCard 
              title="Completed" 
              value={donations.filter(d => d.status === 'completed').length} 
              icon={<FiCheckCircle size={24} />} 
              color="purple" 
            />
            <StatsCard 
              title="Pending/Failed" 
              value={pendingFailedCount} 
              icon={<FiAlertCircle size={24} />} 
              color="yellow" 
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by donor name, email or receipt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="relative md:hidden">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-white"
            >
              <FiFilter size={18} />
              <span>Filter: {filter === 'all' ? 'All' : filter}</span>
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                {['all', 'completed', 'pending', 'failed', 'refunded'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setFilter(option);
                      setShowFilterDropdown(false);
                      setCurrentPage(1);
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-50 capitalize ${
                      filter === option ? 'bg-pink-50 text-pink-600' : ''
                    }`}
                  >
                    {option === 'all' ? 'All Donations' : option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden md:flex gap-2 bg-gray-100 rounded-lg p-1">
            {[
              { value: 'all', label: 'All', icon: <FiDollarSign size={16} /> },
              { value: 'completed', label: 'Completed', icon: <FiCheckCircle size={16} /> },
              { value: 'pending', label: 'Pending', icon: <FiAlertCircle size={16} /> },
              { value: 'failed', label: 'Failed', icon: <FiAlertCircle size={16} /> }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setFilter(tab.value);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  filter === tab.value
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
            <div className="animate-pulse">Loading donations...</div>
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            <FiDollarSign size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No donations found</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-[800px] md:min-w-full w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FiUser size={14} /> Donor
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purpose
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FiCalendar size={14} /> Date
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Receipt
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDonations.map((donation) => (
                      <tr key={donation._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{donation.donorName}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <FiMail size={12} /> {donation.donorEmail}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-bold text-lg ${
                            donation.status === 'completed' ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            ₹{donation.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPurposeColor(donation.purpose)}`}>
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
                        <td className="px-6 py-4">
                          <StatusBadge status={donation.status} />
                        </td>
                        <td className="px-6 py-4">
                          {donation.receiptNumber ? (
                            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                              {donation.receiptNumber}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {deleteConfirm === donation._id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => deleteDonation(donation._id)}
                                className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="bg-gray-400 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-500"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(donation._id)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors group/tooltip relative"
                              title="Delete Donation"
                            >
                              <FiTrash2 size={18} />
                              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Delete Donation
                              </span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                <div className="text-sm text-gray-500">
                  Showing {filteredDonations.length} of {donations.length} donations
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {donations.some(d => d.message && d.status === 'completed') && (
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiHeart className="text-pink-500" /> Donor Messages
            </h2>
            <div className="space-y-4">
              {donations.filter(d => d.message && d.status === 'completed').map((donation) => (
                <div key={donation._id} className="border-l-4 border-pink-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
                  <p className="text-gray-700 italic">"{donation.message}"</p>
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                    <FiUser size={12} /> - {donation.donorName}
                    {donation.isAnonymous && (
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">Anonymous</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Donations;
