import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { API_BASE_URL } from '../../services/config.js';
import { 
  FiArrowLeft,
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiBriefcase, 
  FiClock, 
  FiHeart,
  FiFileText,
  FiSave,
  FiSend,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiAward,
  FiAlertCircle,
  FiHome,
  FiSmartphone,
  FiUsers,
  FiStar
} from 'react-icons/fi';

const VolunteerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const API_URL = API_BASE_URL;
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchVolunteer();
  }, [id]);

  const fetchVolunteer = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/volunteers/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setVolunteer(data.data);
        setAdminNotes(data.data.adminNotes || '');
      }
    } catch (error) {
      console.error('Error fetching volunteer:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/volunteers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, adminNotes })
      });
      if (response.ok) {
        await fetchVolunteer();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/volunteers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: volunteer.status, adminNotes })
      });
      if (response.ok) {
        console.log('Notes saved successfully');
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setSavingNotes(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-gray-500">Loading volunteer details...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!volunteer) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <FiAlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Volunteer Not Found</h2>
          <p className="text-gray-500 mt-2">The volunteer you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/admin/volunteers')}
            className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Back to Volunteers
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/admin/volunteers')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
          >
            <FiArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Volunteers</span>
          </button>
          
          <button
            onClick={() => window.open(`mailto:${volunteer.email}`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FiSend size={16} /> Send Email
          </button>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <FiUser size={36} className="text-white" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{volunteer.fullName}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <StatusBadge status={volunteer.status} />
                  <span className="text-pink-100 text-sm flex items-center gap-1">
                    <FiCalendar size={14} />
                    Applied on {formatDate(volunteer.appliedAt)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-pink-100 text-sm">
                  <span className="flex items-center gap-1">
                    <FiMail size={14} /> {volunteer.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiPhone size={14} /> {volunteer.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiUser className="text-pink-500" size={20} />
                  Personal Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InfoRow icon={<FiUser size={16} />} label="Full Name" value={volunteer.fullName} />
                  <InfoRow icon={<FiMail size={16} />} label="Email Address" value={volunteer.email} />
                  <InfoRow icon={<FiPhone size={16} />} label="Phone Number" value={volunteer.phone} />
                  <InfoRow icon={<FiCalendar size={16} />} label="Age" value={volunteer.age || 'Not specified'} />
                  <InfoRow icon={<FiUsers size={16} />} label="Gender" value={volunteer.gender || 'Not specified'} />
                  <InfoRow icon={<FiBriefcase size={16} />} label="Profession" value={volunteer.profession || 'Not specified'} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiMapPin className="text-pink-500" size={20} />
                  Address
                </h2>
              </div>
              <div className="p-6">
                {volunteer.address?.street || volunteer.address?.city ? (
                  <div className="space-y-2">
                    {volunteer.address.street && <p className="text-gray-700">{volunteer.address.street}</p>}
                    <p className="text-gray-700">
                      {[volunteer.address.city, volunteer.address.state].filter(Boolean).join(', ')}
                      {volunteer.address.pincode && ` - ${volunteer.address.pincode}`}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No address provided</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiStar className="text-pink-500" size={20} />
                  Volunteer Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InfoRow icon={<FiClock size={16} />} label="Availability" value={volunteer.availability} />
                  <InfoRow icon={<FiAward size={16} />} label="Hours/Week" value={volunteer.availableHours ? `${volunteer.availableHours} hours` : 'Not specified'} />
                  <InfoRow icon={<FiUsers size={16} />} label="Skills" value={volunteer.skills?.length ? volunteer.skills.join(', ') : 'Not specified'} />
                </div>
                {volunteer.previousExperience && (
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <FiFileText size={14} /> Previous Experience
                    </label>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{volunteer.previousExperience}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiHeart className="text-pink-500" size={20} />
                  Motivation to Volunteer
                </h2>
              </div>
              <div className="p-6">
                <div className="bg-pink-50 rounded-lg p-5 border-l-4 border-pink-500">
                  <p className="text-gray-700 leading-relaxed italic">"{volunteer.motivation}"</p>
                </div>
              </div>
            </div>

            {volunteer.emergencyContact?.name && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FiAlertCircle className="text-pink-500" size={20} />
                    Emergency Contact
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InfoRow icon={<FiUser size={16} />} label="Contact Name" value={volunteer.emergencyContact.name} />
                    <InfoRow icon={<FiSmartphone size={16} />} label="Contact Phone" value={volunteer.emergencyContact.phone} />
                    <InfoRow icon={<FiHome size={16} />} label="Relation" value={volunteer.emergencyContact.relation} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-6">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiCheckCircle className="text-pink-500" size={20} />
                  Application Status
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Current Status</label>
                  <StatusBadge status={volunteer.status} />
                </div>
                
                {volunteer.status === 'pending' && (
                  <div className="space-y-3 mb-6">
                    <button
                      onClick={() => updateStatus('approved')}
                      disabled={updatingStatus}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm disabled:opacity-50"
                    >
                      <FiCheckCircle size={18} /> 
                      {updatingStatus ? 'Processing...' : 'Approve Application'}
                    </button>
                    <button
                      onClick={() => updateStatus('rejected')}
                      disabled={updatingStatus}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-sm disabled:opacity-50"
                    >
                      <FiXCircle size={18} /> 
                      {updatingStatus ? 'Processing...' : 'Reject Application'}
                    </button>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-5 mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiFileText size={14} /> Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows="5"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm resize-none"
                    placeholder="Add internal notes about this volunteer..."
                  />
                  <button
                    onClick={saveNotes}
                    disabled={savingNotes}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    <FiSave size={16} /> {savingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FiCalendar size={14} /> Application Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Applied On</span>
                  <span className="font-medium text-gray-700">{formatDate(volunteer.appliedAt)}</span>
                </div>
                {volunteer.updatedAt && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Last Updated</span>
                    <span className="font-medium text-gray-700">{formatDate(volunteer.updatedAt)}</span>
                  </div>
                )}
                {volunteer.lastContacted && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Last Contacted</span>
                    <span className="font-medium text-gray-700">{formatDate(volunteer.lastContacted)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-gray-400 mt-0.5">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="font-medium text-gray-800 break-words">{value || '—'}</p>
    </div>
  </div>
);

export default VolunteerDetails;
