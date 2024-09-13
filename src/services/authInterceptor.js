import axios from 'axios';
import { refreshTokenService } from './authService';

// Create an instance of Axios for authenticated requests
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/', // Your backend base URL
});

// Add a request interceptor to attach the access token to every request
api.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        console.log("access token from local storage", token);
        if (token) {
            config.headers['Authorization'] = `JWT ${token}`;
        }

        // Optionally, you can check if the token is expired and refresh it here
        const expirationTime = localStorage.getItem('tokenExpiration');
        const currentTime = Date.now();

        if (token && refreshToken && expirationTime && currentTime >= expirationTime) {
            // If token expired, refresh it
            try {
                token = await refreshTokenService();
                config.headers['Authorization'] = `JWT ${token}`;
            } catch (error) {
                console.error('Failed to refresh token:', error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; // Force re-login if token can't be refreshed
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
