import axios from 'axios';

let base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
if (base.endsWith('/')) base = base.slice(0, -1);
if (base.endsWith('/movies')) base = base.replace('/movies', '');
if (base.endsWith('/bookings')) base = base.replace('/bookings', '');

const API_URL = `${base}/bookings`;

export const bookingService = {
  async getAll() {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async create(bookingData) {
    const response = await axios.post(API_URL, bookingData);
    return response.data;
  }
};
