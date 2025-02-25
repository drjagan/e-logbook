import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized responses
      if (error.response.status === 401) {
        store.dispatch(logout());
      }

      // Return error message from the server if available
      const message = error.response.data?.error?.message || error.message;
      return Promise.reject(new Error(message));
    }

    // Handle network errors
    if (error.request) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
