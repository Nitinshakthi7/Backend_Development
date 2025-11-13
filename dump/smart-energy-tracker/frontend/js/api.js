/**
 * API Wrapper - Complete
 * Handles all backend communication
 */

const API_BASE = 'http://localhost:5000/api';

// Token management
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
};

// Generic API call
async function apiCall(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json'
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth API
const auth = {
  register: (name, email, password) => 
    apiCall('/auth/register', 'POST', { name, email, password }),
  
  login: (email, password) => 
    apiCall('/auth/login', 'POST', { email, password }),
  
  getMe: () => apiCall('/auth/me'),
  
  logout: () => {
    removeToken();
    window.location.href = 'index.html';
  }
};

// Homes API
const homes = {
  getAll: () => apiCall('/homes'),
  getOne: (id) => apiCall(`/homes/${id}`),
  create: (data) => apiCall('/homes', 'POST', data),
  update: (id, data) => apiCall(`/homes/${id}`, 'PUT', data),
  delete: (id) => apiCall(`/homes/${id}`, 'DELETE'),
  addRoom: (homeId, roomData) => apiCall(`/homes/${homeId}/rooms`, 'POST', roomData),
  addDevice: (homeId, roomId, deviceData) => 
    apiCall(`/homes/${homeId}/rooms/${roomId}/devices`, 'POST', deviceData)
};

// Readings API
const readings = {
  create: (data) => apiCall('/readings', 'POST', data),
  createBatch: (homeId, readings) => 
    apiCall('/readings/batch', 'POST', { homeId, readings }),
  getLatest: (homeId) => apiCall(`/readings/latest/${homeId}`)
};

// Analytics API
const analytics = {
  getDashboard: (homeId, period = 'today') => 
    apiCall(`/analytics/dashboard/${homeId}?period=${period}`),
  getHeatmap: (homeId, month) => 
    apiCall(`/analytics/heatmap/${homeId}?month=${month}`),
  getDeviceAnalytics: (homeId, deviceId, days = 7) => 
    apiCall(`/analytics/device/${homeId}/${deviceId}?days=${days}`)
};

// Helpers
const helpers = {
  isAuthenticated: () => !!getToken(),
  requireAuth: () => {
    if (!helpers.isAuthenticated()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
};

console.log('✅ API module loaded');
