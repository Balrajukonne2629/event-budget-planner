import axios from 'axios';

// Create axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Events API
export const eventsAPI = {
  getEvents: () => api.get('/events'),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getEventExpenses: (id) => api.get(`/events/${id}/expenses`),
  addExpense: (id, expenseData) => api.post(`/events/${id}/expenses`, expenseData),
  deleteExpense: (eventId, expenseId) => api.delete(`/events/${eventId}/expenses/${expenseId}`),
  editExpense: (eventId, expenseId, expenseData) =>
    api.put(`/events/${eventId}/expenses/${expenseId}`, expenseData),
  getBudgetSummary: (id) => api.get(`/events/${id}/summary`),
};

export default api;