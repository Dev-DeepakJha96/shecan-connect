import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiLayout, 
  FiUsers, 
  FiDollarSign, 
  FiTrendingUp, 
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiHeart,
  FiTarget,
  FiLoader
} from 'react-icons/fi';
import { API_BASE_URL } from '../../services/config.js';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [snapshotData, setSnapshotData] = useState({
    volunteers: null,
    raised: null,
    projects: null,
    loading: true
  });
  
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
  const token = localStorage.getItem('adminToken');
  const API_URL = API_BASE_URL;

  useEffect(() => {
    const fetchSnapshotData = async () => {
      try {
        const volunteersRes = await fetch(`${API_URL}/api/v1/admin/dashboard/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const volunteersData = await volunteersRes.json();
        
        const donationsRes = await fetch(`${API_URL}/api/v1/donation/admin/donations?limit=1`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const donationsData = await donationsRes.json();
        
        const metricsRes = await fetch(`${API_URL}/api/v1/impact/metrics`);
        const metricsData = await metricsRes.json();
        
        const totalVolunteers = volunteersData.success ? volunteersData.data?.totalVolunteers || 0 : 0;
        const totalRaised = donationsData.success ? donationsData.summary?.totalAmount || 0 : 0;
        
        let projectsCount = 0;
        if (metricsData.success) {
          const projectsMetric = metricsData.data.find(m => m.metricKey === 'active_projects');
          projectsCount = projectsMetric ? projectsMetric.value : metricsData.data.length;
        }
        
        setSnapshotData({
          volunteers: totalVolunteers,
          raised: totalRaised,
          projects: projectsCount,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching snapshot data:', error);
        setSnapshotData(prev => ({ ...prev, loading: false }));
      }
    };
    
    if (token) {
      fetchSnapshotData();
    }
  }, [token]);

  const formatNumber = (num) => {
    if (num === null) return '--';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount) => {
    if (amount === null) return '--';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: <FiLayout size={20} />, label: 'Dashboard' },
    { path: '/admin/volunteers', icon: <FiUsers size={20} />, label: 'Volunteers' },
    { path: '/admin/donations', icon: <FiDollarSign size={20} />, label: 'Donations' },
    { path: '/admin/impact-metrics', icon: <FiTrendingUp size={20} />, label: 'Impact Metrics' },
    { path: '/admin/profile', icon: <FiUser size={20} />, label: 'Profile' },
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`
          fixed top-4 left-4 z-40 md:hidden 
          bg-pink-600 text-white p-2.5 rounded-lg shadow-lg 
          hover:bg-pink-700 transition-all duration-200
          ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
      >
        <FiMenu size={22} />
      </button>

      {isMobileMenuOpen && (
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed top-4 left-4 z-50 md:hidden bg-pink-600 text-white p-2.5 rounded-lg shadow-lg hover:bg-pink-700 transition-all duration-200"
        >
          <FiX size={22} />
        </button>
      )}

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`
        fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-pink-700 to-pink-800 
        text-white shadow-2xl transition-transform duration-300 z-50
        overflow-y-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-6 border-b border-pink-600/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FiHeart size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">NGO Admin</h1>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-pink-600/30">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <FiUser size={14} />
            </div>
            <div>
              <p className="text-sm font-medium text-white truncate max-w-[150px]">
                {adminData.name || 'Admin'}
              </p>
              <p className="text-xs text-pink-200">{adminData.role || 'Administrator'}</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6 px-3 pb-32">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-white/20 text-white shadow-md'
                    : 'text-pink-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="transition-transform duration-200 group-hover:scale-110">
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              {item.label === 'Donations' && (
                <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  New
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-20 left-0 right-0 px-3">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm mx-3">
            <div className="flex items-center gap-2 mb-3">
              <FiTarget size={14} className="text-pink-200" />
              <span className="text-xs text-pink-200 uppercase tracking-wider">Impact Snapshot</span>
              {snapshotData.loading && (
                <FiLoader size={12} className="text-pink-200 animate-spin ml-auto" />
              )}
            </div>
            
            {snapshotData.loading ? (
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <div className="w-12 h-6 bg-white/10 rounded animate-pulse mx-auto"></div>
                  <p className="text-xs text-pink-200 mt-1">Loading</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-6 bg-white/10 rounded animate-pulse mx-auto"></div>
                  <p className="text-xs text-pink-200 mt-1">Loading</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-6 bg-white/10 rounded animate-pulse mx-auto"></div>
                  <p className="text-xs text-pink-200 mt-1">Loading</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-between text-center">
                <div>
                  <p className="text-xl font-bold">{formatNumber(snapshotData.volunteers)}+</p>
                  <p className="text-xs text-pink-200">Volunteers</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{formatCurrency(snapshotData.raised)}</p>
                  <p className="text-xs text-pink-200">Raised</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{formatNumber(snapshotData.projects)}+</p>
                  <p className="text-xs text-pink-200">Projects</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="absolute bottom-0 left-0 right-0 flex items-center gap-3 px-6 py-4 bg-pink-800 hover:bg-pink-900 transition-all duration-200 group"
        >
          <FiLogOut size={20} className="transition-transform duration-200 group-hover:rotate-180" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden" aria-hidden="true" />
      )}
    </>
  );
};

export default Sidebar;
