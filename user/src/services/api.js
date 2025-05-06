import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Don't auto-redirect during login/registration flows
    const isAuthEndpoint = error.config?.url?.includes('/auth/');
    
    // Handle session timeout/auth errors, but not for auth endpoints
    if (error.response && error.response.status === 401 && !isAuthEndpoint) {
      // Clear local auth data and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
const endpoints = {
  // Auth related endpoints
  auth: {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    verifyEmail: (verificationData) => api.post('/auth/verify-email', verificationData),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (resetData) => api.post('/auth/reset-password', resetData),
  },
  
  // User related endpoints
  user: {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/profile', data),
    getActivity: () => api.get('/user/activity'),
    getPoints: () => api.get('/user/points'),
    getReferrals: () => api.get('/user/referrals'),
  },
  
  // Offer related endpoints
  offers: {
    getAll: () => api.get('/offers'),
    getProviders: () => api.get('/offers/providers'),
    getById: (offerId) => api.get(`/offers/${offerId}`),
    trackClick: (offerId) => api.post(`/offers/${offerId}/click`),
    getHistory: (params = {}) => api.get('/offers/history', { params }),
  },
  
  // Video related endpoints
  videos: {
    getAll: (params = {}) => api.get('/videos', { params }),
    getById: (videoId) => api.get(`/videos/${videoId}`),
    startWatching: (videoId) => api.post(`/videos/${videoId}/start`),
    completeWatching: (videoId, watchTimeSeconds) => api.post(`/videos/${videoId}/complete`, { watch_time_seconds: watchTimeSeconds }),
    getHistory: (params = {}) => api.get('/videos/history', { params }),
  },
  
  // Rewards related endpoints
  rewards: {
    getAll: (filters = {}) => api.get('/rewards', { params: filters }),
    getCategories: () => api.get('/rewards/categories'),
    getById: (rewardId) => api.get(`/rewards/${rewardId}`),
    redeem: (rewardId, paymentDetails) => api.post(`/rewards/${rewardId}/redeem`, { payment_details: paymentDetails }),
    getHistory: (params = {}) => api.get('/rewards/history', { params }),
    getRedemptionStatus: (redemptionId) => api.get(`/rewards/redemptions/${redemptionId}`),
  },
  
  // Chat related endpoints
  chat: {
    getMessages: () => api.get('/chat/messages'),
    sendMessage: (messageData) => api.post('/chat/messages', messageData),
  },
  
  // Referral endpoints
  referrals: {
    getAll: () => api.get('/referrals'),
    getInfo: () => api.get('/referrals/info'),
    getStats: () => api.get('/referrals/stats'),
    validateCode: (referralCode) => api.post('/referrals/validate', { referral_code: referralCode }),
  },
  
  // General API status
  status: {
    check: () => api.get('/status'),
  }
};

export default endpoints;