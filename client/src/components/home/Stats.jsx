import React, { useState, useEffect } from 'react';
import {
  FaClock,
  FaGlobe,
  FaCheckCircle,
  FaGraduationCap,
  FaHeart,
  FaUsers,
  FaUtensils,
  FaHandsHelping,
} from "react-icons/fa";
import { API_BASE_URL } from '../../services/config.js';

const getIconForMetric = (metricKey) => {
  const icons = {
    women_trained: FaGraduationCap,
    partner_communities: FaGlobe,
    volunteer_hours: FaClock,
    success_rate: FaCheckCircle,
    children_helped: FaUsers,
    meals_served: FaUtensils,
    lives_impacted: FaHeart,
    active_volunteers: FaHandsHelping,
  };
  return icons[metricKey] || FaCheckCircle;
};

const getLabelForMetric = (metricKey, defaultLabel) => {
  const labels = {
    women_trained: 'Women Trained',
    partner_communities: 'Partner Communities',
    volunteer_hours: 'Volunteer Hours',
    success_rate: 'Success Rate',
    children_helped: 'Children Helped',
    meals_served: 'Meals Served',
    lives_impacted: 'Lives Impacted',
    active_volunteers: 'Active Volunteers',
  };
  return labels[metricKey] || defaultLabel;
};

const formatNumber = (value, unit) => {
  if (unit === 'percentage') {
    return `${value}%`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M+`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K+`;
  }
  return `${value}+`;
};

const Stats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = API_BASE_URL;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/impact/metrics`);
      const data = await response.json();
      
      if (data.success) {
        const formattedStats = data.data.map(metric => ({
          number: formatNumber(metric.value, metric.unit === '%' ? 'percentage' : 'number'),
          label: getLabelForMetric(metric.metricKey, metric.label),
          icon: getIconForMetric(metric.metricKey),
          rawValue: metric.value,
          unit: metric.unit,
          metricKey: metric.metricKey
        }));
        setStats(formattedStats);
      } else {
        setError('Failed to load statistics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Network error loading statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white" id="metrics">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <p className="mt-4 opacity-80">Loading impact metrics...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white" id="metrics">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/80">Unable to load statistics. Please refresh the page.</p>
        </div>
      </section>
    );
  }

  if (stats.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white" id="metrics">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Our Impact in Numbers</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Together, we're making a difference in communities across the nation
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="group transform transition-all duration-300 hover:scale-105"
            >
              <stat.icon className="text-5xl mx-auto mb-4 opacity-90 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-4xl font-extrabold mb-2">
                {stat.number}
              </h3>
              <p className="opacity-90 text-sm uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-white/50">
            Updated in real-time • Data as of {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Stats;
