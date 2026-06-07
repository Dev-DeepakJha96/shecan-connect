import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { API_BASE_URL } from '../../services/config.js';
import { 
  FiUsers, 
  FiEye, 
  FiCheckCircle, 
  FiXCircle, 
  FiTrash2,
  FiSearch,
  FiFilter,
  FiPhone,
  FiCalendar,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical,
  FiMail
} from 'react-icons/fi';

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  
  const navigate = useNavigate();
  const filterDropdownRef = useRef(null);
  const actionMenuRefs = useRef({});

  const API_URL = API_BASE_URL;
  const token = localStorage.getItem('adminToken');
  const itemsPerPage = 5;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
      
      if (actionMenuOpen) {
        const isClickInsideMenu = actionMenuRefs.current[actionMenuOpen]?.contains(event.target);
        if (!isClickInsideMenu) {
          setActionMenuOpen(null);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [actionMenuOpen]);

  useEffect(() => {
    fetchVolunteers();
  }, [filter, currentPage]);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' 
    ? `${API_URL}/api/v1/admin/volunteers?page=${currentPage}&limit=${itemsPerPage}`
        : `${API_URL}/api/v1/admin/volunteers?status=${filter}&page=${currentPage}&limit=${itemsPerPage}`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setVolunteers(data.data);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
    const response = await fetch(`${API_URL}/api/v1/admin/volunteers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchVolunteers();
        setActionMenuOpen(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteVolunteer = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        const response = await fetch(`${API_URL}/api/v1/admin/volunteers/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          fetchVolunteers();
          setActionMenuOpen(null);
        }
      } catch (error) {
        console.error('Error deleting volunteer:', error);
      }
    }
  };

  const filteredVolunteers = volunteers.filter(volunteer => 
    volunteer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.phone?.includes(searchTerm)
  );

  const getStatusCount = (status) => {
    return volunteers.filter(v => status === 'all' ? true : v.status === status).length;
  };

  const toggleActionMenu = (id, event) => {
    event.stopPropagation();
    setActionMenuOpen(actionMenuOpen === id ? null : id);
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Volunteers</h1>
            <p className="text-gray-500 mt-1">Manage and review volunteer applications</p>
          </div>
          
          <div className="relative md:hidden" ref={filterDropdownRef}>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-white"
            >
              <FiFilter size={18} />
              <span>Filter: {filter === 'all' ? 'All' : filter}</span>
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                {['all', 'pending', 'approved', 'rejected'].map((option) => (
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
                    {option === 'all' ? 'All Applications' : option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden md:flex gap-2 bg-gray-100 rounded-lg p-1">
            {[
              { value: 'all', label: 'All', icon: <FiUsers size={16} /> },
              { value: 'pending', label: 'Pending', icon: <FiSearch size={16} /> },
              { value: 'approved', label: 'Approved', icon: <FiCheckCircle size={16} /> },
              { value: 'rejected', label: 'Rejected', icon: <FiXCircle size={16} /> }
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
                {tab.value !== 'all' && (
                  <span className={`text-xs ml-1 ${
                    filter === tab.value ? 'text-pink-200' : 'text-gray-400'
                  }`}>
                    ({getStatusCount(tab.value)})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
            <div className="animate-pulse">Loading volunteers...</div>
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            <FiUsers size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No volunteers found</p>
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
                          <FiUser size={14} /> Name
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FiMail size={14} /> Contact
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FiCalendar size={14} /> Applied On
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredVolunteers.map((volunteer) => (
                      <tr key={volunteer._id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-gray-900">{volunteer.fullName}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <FiPhone size={12} /> {volunteer.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-600">{volunteer.email}</div>
                          <div className="text-xs text-gray-400 mt-1">{volunteer.profession || 'No profession specified'}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(volunteer.appliedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={volunteer.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="hidden md:flex items-center justify-center gap-3">
                            <button
                              onClick={() => navigate(`/admin/volunteers/${volunteer._id}`)}
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group/tooltip relative"
                              title="View Details"
                            >
                              <FiEye size={18} />
                              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                View Details
                              </span>
                            </button>

                            {volunteer.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateStatus(volunteer._id, 'approved')}
                                  className="p-2 rounded-lg text-green-600 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group/tooltip relative"
                                  title="Approve"
                                >
                                  <FiCheckCircle size={18} />
                                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    Approve
                                  </span>
                                </button>

                                <button
                                  onClick={() => updateStatus(volunteer._id, 'rejected')}
                                  className="p-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group/tooltip relative"
                                  title="Reject"
                                >
                                  <FiXCircle size={18} />
                                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    Reject
                                  </span>
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => deleteVolunteer(volunteer._id)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group/tooltip relative"
                              title="Delete"
                            >
                              <FiTrash2 size={18} />
                              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Delete
                              </span>
                            </button>
                          </div>

                          <div className="relative md:hidden flex justify-center">
                            <button
                              onClick={(e) => toggleActionMenu(volunteer._id, e)}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                              <FiMoreVertical size={18} />
                            </button>
                            
                            {actionMenuOpen === volunteer._id && (
                              <div 
                                ref={el => actionMenuRefs.current[volunteer._id] = el}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20 py-1"
                              >
                                <button
                                  onClick={() => {
                                    navigate(`/admin/volunteers/${volunteer._id}`);
                                    setActionMenuOpen(null);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-blue-600"
                                >
                                  <FiEye size={14} /> View Details
                                </button>
                                
                                {volunteer.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => updateStatus(volunteer._id, 'approved')}
                                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-green-600"
                                    >
                                      <FiCheckCircle size={14} /> Approve
                                    </button>
                                    <button
                                      onClick={() => updateStatus(volunteer._id, 'rejected')}
                                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-600"
                                    >
                                      <FiXCircle size={14} /> Reject
                                    </button>
                                  </>
                                )}
                                
                                <button
                                  onClick={() => deleteVolunteer(volunteer._id)}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-600"
                                >
                                  <FiTrash2 size={14} /> Delete
                                </button>
                              </div>
                            )}
                          </div>
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
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-sm"
                  >
                    <FiChevronLeft size={16} /> Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-sm"
                  >
                    Next <FiChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Volunteers;
