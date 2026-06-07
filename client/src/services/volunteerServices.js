import api from './api.js';

export const submitVolunteerForm = async (data) => {
  try {
    const response = await api.post('/volunteer/register', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};