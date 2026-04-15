import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const normalizedApiUrl = configuredApiUrl
  ? configuredApiUrl.replace(/\/+$/, '').endsWith('/api')
    ? configuredApiUrl.replace(/\/+$/, '')
    : `${configuredApiUrl.replace(/\/+$/, '')}/api`
  : '/api';

const axiosClient = axios.create({
  baseURL: normalizedApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
axiosClient.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch {
        // Invalid userInfo, ignore
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
