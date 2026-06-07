import React, { useState } from 'react';
import { FiSearch, FiCopy, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { API_BASE_URL } from '../services/config';

const TrackStatus = () => {
  const [trackingId, setTrackingId] = useState('');
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const API_URL = API_BASE_URL;

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    
    setLoading(true);
    setError('');
    setApplication(null);
    
    try {
      const response = await fetch(`${API_URL}/api/v1/volunteer/track/${trackingId}`);
      const data = await response.json();
      
      if (data.success) {
        setApplication(data.data);
      } else {
        setError(data.message || 'Application not found');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyTrackingId = () => {
    if(!trackingId.trim()) return;
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusDisplay = (status) => {
    switch(status) {
      case 'pending':
        return { icon: <FiClock size={20} />, text: 'Pending Review', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-500' };
      case 'approved':
        return { icon: <FiCheckCircle size={20} />, text: 'Approved!', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-500' };
      case 'rejected':
        return { icon: <FiXCircle size={20} />, text: 'Not Selected', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-500' };
      default:
        return { icon: <FiClock size={20} />, text: 'Processing', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-500' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Track Your Application</h1>
          <p className="text-gray-600">Enter your Tracking ID to check application status</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  placeholder="e.g., VOL-20241215-001"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 uppercase"
                />
                <button
                  type="button"
                  onClick={copyTrackingId}
                  className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Copy"
                >
                  {copied ? <FiCheckCircle className="text-green-600" /> : <FiCopy />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Lost your ID? Check your email for the confirmation message.
              </p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
            >
              <FiSearch size={18} />
              {loading ? 'Checking...' : 'Track Application'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
            <p className="text-sm text-red-500 mt-1">
              Check your email for the correct Tracking ID
            </p>
          </div>
        )}

        {/* Application Status Card */}
        {application && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Status Header */}
            <div className={`p-6 ${getStatusDisplay(application.status).bg} border-l-4 ${getStatusDisplay(application.status).border}`}>
              <div className="flex items-center gap-3">
                <span className={getStatusDisplay(application.status).color}>
                  {getStatusDisplay(application.status).icon}
                </span>
                <div>
                  <p className="text-sm text-gray-500">Current Status</p>
                  <p className={`text-xl font-bold ${getStatusDisplay(application.status).color}`}>
                    {getStatusDisplay(application.status).text}
                  </p>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Applicant Name</p>
                  <p className="font-medium text-gray-800">{application.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-800">{application.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Application Date</p>
                  <p className="font-medium text-gray-800">
                    {new Date(application.appliedDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-800">
                    {new Date(application.lastUpdated).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              {application.statusHistory && application.statusHistory.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-3">Application Timeline</p>
                  <div className="space-y-3">
                    {application.statusHistory.map((history, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 capitalize">
                            {history.status}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(history.changedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps based on status */}
              {application.status === 'approved' && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">📌 Next Steps</p>
                  <p className="text-sm text-green-700 mt-1">
                    You will receive an onboarding email shortly with further instructions.
                  </p>
                </div>
              )}
              
              {application.status === 'pending' && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">⏳ Under Review</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Our team is reviewing your application. We'll notify you once a decision is made.
                  </p>
                </div>
              )}
              
              {application.status === 'rejected' && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-800">📌 Important</p>
                  <p className="text-sm text-red-700 mt-1">
                    Your application was not selected at this time. You can reapply in the future.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Didn't receive your Tracking ID?{' '}
            <a  className="text-pink-600 hover:text-pink-700">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackStatus;