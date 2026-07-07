import axios from 'axios';

let base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
if (base.endsWith('/')) base = base.slice(0, -1);
if (base.endsWith('/movies')) base = base.replace('/movies', '');
if (base.endsWith('/bookings')) base = base.replace('/bookings', '');

const API_URL = `${base}/movies`;

export const movieService = {
  async getAll() {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async getById(id) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  async create(movieData) {
    const response = await axios.post(API_URL, movieData);
    return response.data;
  },

  async update(id, movieData) {
    const response = await axios.put(`${API_URL}/${id}`, movieData);
    return response.data;
  },

  async delete(id) {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
};
