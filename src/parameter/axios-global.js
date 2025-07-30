import axios from 'axios';

// Create a custom Axios instance
const apiClient = axios.create({
  baseURL: 'https://take-home-test-api.nutech-integrasi.com', // Your API base URL
  timeout: 2000, // Optional: Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
    // You can also add other default headers here, e.g., for authorization
    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  },
});
apiClient.interceptors.request.use(
  (config) => {
    // For example, add an Authorization header dynamically
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default apiClient