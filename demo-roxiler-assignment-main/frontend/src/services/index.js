import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updatePassword: async (password) => {
    const response = await api.put('/auth/password', { password });
    return response.data;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export const storeService = {
  getAllStores: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/stores?${params}`);
    return response.data;
  },

  getStoreDetails: async (id) => {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },

  getMyStore: async () => {
    const response = await api.get('/stores/my/store');
    return response.data;
  },
};

export const ratingService = {
  submitRating: async (storeId, rating) => {
    const response = await api.post('/ratings', { store_id: storeId, rating });
    return response.data;
  },

  updateRating: async (storeId, rating) => {
    const response = await api.put('/ratings', { store_id: storeId, rating });
    return response.data;
  },

  deleteRating: async (storeId) => {
    const response = await api.delete(`/ratings/store/${storeId}`);
    return response.data;
  },

  getUserRating: async (storeId) => {
    const response = await api.get(`/ratings/store/${storeId}/my-rating`);
    return response.data;
  },
};

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  getAllUsers: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/users?${params}`);
    return response.data;
  },

  getUserDetails: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  createStore: async (storeData) => {
    const response = await api.post('/admin/stores', storeData);
    return response.data;
  },

  getAllStores: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/stores?${params}`);
    return response.data;
  },

  deleteStore: async (id) => {
    const response = await api.delete(`/admin/stores/${id}`);
    return response.data;
  },
};
