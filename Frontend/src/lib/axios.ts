import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
  timeout: 15000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Attach the auth token if available
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle common error responses globally
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // 401 Unauthorized: token expired or invalid
      if (status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          // Redirect to signin page
          window.location.href = '/signin';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
