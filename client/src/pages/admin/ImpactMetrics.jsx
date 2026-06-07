import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { API_BASE_URL } from '../../services/config.js';
import { 
  FiTrendingUp, 
  FiEdit2, 
  FiSave, 
  FiX, 
  FiRefreshCw,
  FiActivity,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiPlusCircle,
  FiHeart,
  FiTarget,
  FiUsers,
  FiDollarSign,
  FiBookOpen,
  FiHome
} from 'react-icons/fi';

const getIconComponent = (iconName, size = 28) => {
  const icons = {
    'trending-up': <FiTrendingUp size={size} />,
    'activity': <FiActivity size={size} />,
    'check-circle': <FiCheckCircle size={size} />,
    'alert-circle': <FiAlertCircle size={size} />,
    'users': <FiUsers size={size} />,
    'heart': <FiHeart size={size} />,
    'target': <FiTarget size={size} />,
    'dollar': <FiDollarSign size={size} />,
    'book': <FiBookOpen size={size} />,
    'home': <FiHome size={size} />
  };
  return icons[iconName] || <FiTrendingUp size={size} />;
};

const availableIcons = [
  { value: 'trending-up', label: 'Trending Up', icon: <FiTrendingUp size={20} /> },
  { value: 'activity', label: 'Activity', icon: <FiActivity size={20} /> },
  { value: 'check-circle', label: 'Check Circle', icon: <FiCheckCircle size={20} /> },
  { value: 'users', label: 'Users', icon: <FiUsers size={20} /> },
  { value: 'heart', label: 'Heart', icon: <FiHeart size={20} /> },
  { value: 'target', label: 'Target', icon: <FiTarget size={20} /> },
  { value: 'dollar', label: 'Dollar', icon: <FiDollarSign size={20} /> },
  { value: 'book', label: 'Book', icon: <FiBookOpen size={20} /> },
  { value: 'home', label: 'Home', icon: <FiHome size={20} /> }
];

const ImpactMetrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [newMetric, setNewMetric] = useState({
    metricKey: '',
    label: '',
    value: 0,
    unit: '',
    icon: 'trending-up',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = API_BASE_URL;
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/v1/impact/metrics`);
      const data = await response.json();
      if (data.success) {
        setMetrics(data.data);
      } else {
        setError('Failed to fetch metrics');
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateMetric = async (key, value) => {
    setUpdatingId(key);
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/impact/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ value: parseInt(value) })
      });
      
      if (response.ok) {
        await fetchMetrics();
        setEditingId(null);
        setEditValue('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update metric');
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error('Error updating metric:', error);
      setError('Error updating metric');
      setTimeout(() => setError(null), 3000);
    } finally {
      setUpdatingId(null);
    }
  };

  const addNewMetric = async () => {
    if (!newMetric.metricKey.trim()) {
      setError('Metric key is required');
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (!newMetric.label.trim()) {
      setError('Label is required');
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (newMetric.value < 0) {
      setError('Value cannot be negative');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (metrics.some(m => m.metricKey === newMetric.metricKey)) {
      setError('Metric key already exists. Please use a different key.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/impact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newMetric)
      });
      
      if (response.ok) {
        await fetchMetrics();
        setShowAddModal(false);
        setNewMetric({
          metricKey: '',
          label: '',
          value: 0,
          unit: '',
          icon: 'trending-up',
          description: ''
        });
        setError({ type: 'success', text: 'Metric added successfully!' });
        setTimeout(() => setError(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add metric');
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error('Error adding metric:', error);
      setError('Error adding metric');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMetric = async (metricKey) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/impact/${metricKey}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        await fetchMetrics();
        setShowDeleteConfirm(null);
        setError({ type: 'success', text: 'Metric deleted successfully!' });
        setTimeout(() => setError(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete metric');
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error('Error deleting metric:', error);
      setError('Error deleting metric');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleIncrement = (metric, amount = 1) => {
    const newValue = metric.value + amount;
    updateMetric(metric.metricKey, newValue);
  };

  const handleDecrement = (metric, amount = 1) => {
    if (metric.value - amount >= 0) {
      const newValue = metric.value - amount;
      updateMetric(metric.metricKey, newValue);
    }
  };

  const getTotalImpact = () => {
    return metrics.reduce((total, metric) => total + metric.value, 0);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <FiLoader size={40} className="text-pink-600 animate-spin" />
            <p className="text-gray-500">Loading impact metrics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6">
        {error && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
            error.type === 'success' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {error.type === 'success' ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
            {typeof error === 'string' ? error : error.text}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Impact Metrics</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">Track and manage your organization's impact statistics</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm sm:text-base"
            >
              <FiPlusCircle size={18} /> Add Metric
            </button>
            <button
              onClick={fetchMetrics}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
            >
              <FiRefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-pink-100 text-sm">Total Impact</p>
              <p className="text-3xl sm:text-4xl font-bold">{getTotalImpact().toLocaleString()}</p>
              <p className="text-pink-100 text-xs mt-1">Across {metrics.length} metrics</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <FiActivity size={28} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((metric) => (
            <div 
              key={metric._id} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group relative"
            >
              <div className="p-4 sm:p-5">
                <div className="flex  justify-between mb-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600">
                    {getIconComponent(metric.icon, 28)}
                  </div>
                  {editingId !== metric._id && (
                    <div className='flex gap-1'>
                    <button
                      onClick={() => {
                        setEditingId(metric._id);
                        setEditValue(metric.value.toString());
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                      title="Edit metric"
                    >
                      <FiEdit2 size={14} />
                    </button>
                     <button
                onClick={() => setShowDeleteConfirm(metric.metricKey)}
                className=" opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 z-10"
                title="Delete metric"
              >
                <FiTrash2 size={14} />
              </button>
                      </div>
                  )}
                </div>
                
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">{metric.label}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Key: {metric.metricKey}</p>
                
                {editingId === metric._id ? (
                  <div className="mt-3 space-y-2">
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateMetric(metric.metricKey, editValue)}
                        disabled={updatingId === metric.metricKey}
                        className="flex-1 flex items-center justify-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        {updatingId === metric.metricKey ? (
                          <FiLoader size={14} className="animate-spin" />
                        ) : (
                          <FiSave size={14} />
                        )}
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 flex items-center justify-center gap-1 bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                      >
                        <FiX size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mt-3">
                      <p className="text-3xl sm:text-4xl font-bold text-pink-600">
                        {metric.value.toLocaleString()}
                      </p>
                      {metric.unit && (
                        <p className="text-xs text-gray-500 mt-0.5">{metric.unit}</p>
                      )}
                    </div>
                    
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleDecrement(metric, 1)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        title="Decrease by 1"
                      >
                        <FiMinus size={12} /> Decrease
                      </button>
                      <button
                        onClick={() => handleIncrement(metric, 1)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors text-sm"
                        title="Increase by 1"
                      >
                        <FiPlus size={12} /> Increase
                      </button>
                    </div>
                    
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleIncrement(metric, 10)}
                        className="flex-1 text-xs py-1 bg-gray-50 text-gray-500 rounded hover:bg-gray-100 transition-colors"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => handleIncrement(metric, 25)}
                        className="flex-1 text-xs py-1 bg-gray-50 text-gray-500 rounded hover:bg-gray-100 transition-colors"
                      >
                        +25
                      </button>
                      <button
                        onClick={() => handleIncrement(metric, 50)}
                        className="flex-1 text-xs py-1 bg-gray-50 text-gray-500 rounded hover:bg-gray-100 transition-colors"
                      >
                        +50
                      </button>
                      <button
                        onClick={() => handleIncrement(metric, 100)}
                        className="flex-1 text-xs py-1 bg-gray-50 text-gray-500 rounded hover:bg-gray-100 transition-colors"
                      >
                        +100
                      </button>
                    </div>
                  </>
                )}
                
                {metric.description && (
                  <p className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100">
                    {metric.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {metrics.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FiActivity size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No impact metrics found</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Add Your First Metric
            </button>
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Add New Impact Metric</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Metric Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newMetric.metricKey}
                    onChange={(e) => setNewMetric({ ...newMetric, metricKey: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., children_helped, meals_served"
                  />
                  <p className="text-xs text-gray-500 mt-1">Unique identifier (lowercase, use underscores)</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Label <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newMetric.label}
                    onChange={(e) => setNewMetric({ ...newMetric, label: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., Children Helped"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newMetric.value}
                    onChange={(e) => setNewMetric({ ...newMetric, value: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Unit</label>
                  <input
                    type="text"
                    value={newMetric.unit}
                    onChange={(e) => setNewMetric({ ...newMetric, unit: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., children, meals, villages"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Icon</label>
                  <div className="grid grid-cols-5 gap-2">
                    {availableIcons.map((icon) => (
                      <button
                        key={icon.value}
                        onClick={() => setNewMetric({ ...newMetric, icon: icon.value })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          newMetric.icon === icon.value
                            ? 'border-pink-500 bg-pink-50 text-pink-600'
                            : 'border-gray-200 hover:border-gray-300 text-gray-500'
                        }`}
                        title={icon.label}
                      >
                        {icon.icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    value={newMetric.description}
                    onChange={(e) => setNewMetric({ ...newMetric, description: e.target.value })}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Brief description of this metric..."
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={addNewMetric}
                  disabled={isSubmitting}
                  className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  {isSubmitting ? 'Adding...' : 'Add Metric'}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <FiAlertCircle size={24} className="text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Delete Metric</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this metric? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => deleteMetric(showDeleteConfirm)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 sm:mt-8 bg-blue-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
            <div>
              <p className="text-sm text-blue-800 font-medium">How to Manage Metrics</p>
              <p className="text-xs text-blue-600 mt-1">
                • <strong>Edit:</strong> Click the edit icon or use +/- buttons to update values<br />
                • <strong>Add New:</strong> Use the "Add Metric" button to create new impact metrics<br />
                • <strong>Delete:</strong> Hover over any metric card and click the trash icon<br />
                • Changes are saved immediately to the database
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ImpactMetrics;
