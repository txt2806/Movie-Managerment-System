import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/bookings` 
  : 'http://localhost:5000/bookings';

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
