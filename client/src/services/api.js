import axios from "axios";
import { API_BASE_URL, API_PREFIX } from './config.js';

const api = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;