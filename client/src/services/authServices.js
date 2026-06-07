import api from './api.js';

export const loginAdmin = async (credentials) => {
  const response = await api.post('/admin/auth/login', credentials);
  return response.data;
};

export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
};

export const getStoredAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem('adminData') || '{}');
  } catch (error) {
    return {};
  }
};