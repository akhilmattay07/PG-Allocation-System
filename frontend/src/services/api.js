import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },
};

// PG Listings API
export const pgAPI = {
  getAllPGs: async () => {
    const response = await api.get('/pgs');
    return response.data;
  },

  searchPGs: async (filters) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/search?${params.toString()}`);
    return response.data;
  },

  getPGById: async (id) => {
    const response = await api.get(`/pg/${id}`);
    return response.data;
  },

  getPGsByOwner: async (ownerId) => {
    const response = await api.get(`/owner/pgs/${ownerId}`);
    return response.data;
  },

  addPG: async (pgData) => {
    const response = await api.post('/owner/add', pgData);
    return response.data;
  },

  updatePG: async (pgData) => {
    const response = await api.put('/owner/update', pgData);
    return response.data;
  },

  deletePG: async (pgId, ownerId) => {
    const response = await api.delete(`/owner/delete/${pgId}/${ownerId}`);
    return response.data;
  },
};

// Booking API
export const bookingAPI = {
  createBooking: async (bookingData) => {
    const response = await api.post('/book', bookingData);
    return response.data;
  },

  getUserBookings: async (userId) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  },

  getOwnerBookings: async (ownerId) => {
    const response = await api.get(`/bookings/owner/${ownerId}`);
    return response.data;
  },

  updateBookingStatus: async (bookingId, status) => {
    const response = await api.put(`/booking/status/${bookingId}`, { status });
    return response.data;
  },
};

export default api;
