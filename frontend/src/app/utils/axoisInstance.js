// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Read base URL from environment variables
    timeout: 10000, // Set a timeout for requests
    headers: {
        'Content-Type': 'application/json',
    },
});


// Add request interceptor (Optional: Add auth tokens or log requests)
axiosInstance.interceptors.request.use(
    (config) => {
        // Modify request config if needed
        // e.g., config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor (Optional: Handle errors globally)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle errors globally, e.g., logging or user notifications
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;
