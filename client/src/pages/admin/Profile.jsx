import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { API_BASE_URL } from '../../services/config.js';
import { 
  FiUser, 
  FiMail, 
  FiShield, 
  FiCalendar, 
  FiEdit2, 
  FiSave, 
  FiX,
  FiInfo,
  FiCheckCircle,
  FiAlertCircle,
  FiCamera,
  FiBriefcase,
  FiMapPin,
  FiPhone
} from 'react-icons/fi';

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(JSON.parse(localStorage.getItem('adminData') || '{}'));
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAdminData(data.data);
        console.log(data)
        localStorage.setItem('adminData', JSON.stringify(data.data));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editedName.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: editedName })
      });
      
      const data = await response.json();
      if (data.success) {
        const updatedData = { ...adminData, name: editedName };
        setAdminData(updatedData);
        localStorage.setItem('adminData', JSON.stringify(updatedData));
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Error updating profile' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating profile' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-700',
      admin: 'bg-blue-100 text-blue-700',
      editor: 'bg-green-100 text-green-700',
      viewer: 'bg-gray-100 text-gray-700'
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  const getRoleIcon = (role) => {
    const icons = {
      super_admin: <FiShield size={14} />,
      admin: <FiUser size={14} />,
      editor: <FiEdit2 size={14} />,
      viewer: <FiInfo size={14} />
    };
    return icons[role] || <FiUser size={14} />;
  };

  const getRoleDisplayName = (role) => {
    const names = {
      super_admin: 'Super Administrator',
      admin: 'Administrator',
      editor: 'Editor',
      viewer: 'Viewer'
    };
    return names[role] || role;
  };

  const getProfilePicture = () => {
    if (adminData.profilePicture && !imageError) {
      console.log(adminData.profilePicture);
      return adminData.profilePicture 
;
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Profile</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">View and manage your profile information</p>
        </div>

        {message && (
          <div className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg animate-slide-in ${
            message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {message.type === 'success' ? <FiCheckCircle size={16} /> : <FiAlertCircle size={16} />}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm overflow-hidden">
                    {getProfilePicture() ? (
                      <img 
                        src={getProfilePicture()} 
                        alt={adminData.name}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <FiUser size={32} className="text-white" />
                    )}
                  </div>
                  {adminData.profilePicture && !imageError && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                      <FiCheckCircle size={10} className="text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  {!isEditing ? (
                    <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{adminData.name}</h2>
                  ) : (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-xl sm:text-2xl font-bold bg-white/20 text-white placeholder-white/50 rounded-lg px-2 sm:px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="Enter your name"
                    />
                  )}
                  <div className="flex items-center gap-2 mt-1 sm:mt-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(adminData.role)}`}>
                      {getRoleIcon(adminData.role)}
                      <span className="hidden sm:inline">{getRoleDisplayName(adminData.role)}</span>
                      <span className="sm:hidden">{adminData.role?.replace('_', ' ')}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              {!isEditing ? (
                <button
                  onClick={() => {
                    setEditedName(adminData.name);
                    setIsEditing(true);
                  }}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors text-sm sm:text-base"
                >
                  <FiEdit2 size={14} /> 
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 rounded-lg text-white hover:bg-green-600 transition-colors text-sm sm:text-base"
                  >
                    <FiSave size={14} /> 
                    <span>{loading ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-500 rounded-lg text-white hover:bg-gray-600 transition-colors text-sm sm:text-base"
                  >
                    <FiX size={14} /> 
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiMail className="text-gray-400 flex-shrink-0" size={18} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-800 truncate text-sm sm:text-base">{adminData.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiShield className="text-gray-400 flex-shrink-0" size={18} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Role & Permissions</p>
                  <p className="font-medium text-gray-800 capitalize text-sm sm:text-base">{adminData.role?.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiCalendar className="text-gray-400 flex-shrink-0" size={18} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Account Created</p>
                  <p className="font-medium text-gray-800 text-sm sm:text-base">
                    {adminData.createdAt 
                      ? new Date(adminData.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })
                      : 'Information not available'}
                  </p>
                </div>
              </div>

              {adminData.phone && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiPhone className="text-gray-400 flex-shrink-0" size={18} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-800 text-sm sm:text-base">{adminData.phone}</p>
                  </div>
                </div>
              )}

              {adminData.department && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiBriefcase className="text-gray-400 flex-shrink-0" size={18} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="font-medium text-gray-800 text-sm sm:text-base">{adminData.department}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border-t border-blue-100 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <FiInfo className="text-blue-500 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-xs sm:text-sm text-blue-800 font-medium">About Your Account</p>
                <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                  Your role determines what actions you can perform in the admin panel. 
                  Contact your super admin if you need additional permissions or want to change your password.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 text-center hover:shadow-md transition-shadow">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FiUser className="text-pink-600" size={18} />
            </div>
            <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Manage Volunteers</h4>
            <p className="text-xs text-gray-500 mt-1 hidden sm:block">Review and approve applications</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 text-center hover:shadow-md transition-shadow">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FiCheckCircle className="text-green-600" size={18} />
            </div>
            <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Track Donations</h4>
            <p className="text-xs text-gray-500 mt-1 hidden sm:block">View all donation records</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 text-center hover:shadow-md transition-shadow">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FiShield className="text-purple-600" size={18} />
            </div>
            <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{getRoleDisplayName(adminData.role)}</h4>
            <p className="text-xs text-gray-500 mt-1 hidden sm:block">Current role permissions</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminProfile;
