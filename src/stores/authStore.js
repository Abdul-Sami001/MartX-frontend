import { create } from 'zustand';
import axios from 'axios';
import { refreshTokenService } from '../services/authService';  // Import refresh token service
import api from '../services/authInterceptor';  // Axios instance with interceptor

// Auth Store using Zustand
const useAuthStore = create((set) => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    user: null,

    // Action to login
    login: async (credentials) => {
        try {
            let newCredentials = {
                username: credentials.email,
                password: credentials.password
            }
            // Login and get tokens
            const response = await axios.post('http://127.0.0.1:8000/auth/jwt/create/', newCredentials);
            const { access, refresh } = response.data;

            // Store tokens
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            console.log(access)
            // Fetch the user's profile using the /users/me/ endpoint
            const userProfileResponse = await api.get('/auth/users/me/');
            console.log('User profile:', userProfileResponse.data);
            const user = userProfileResponse.data;

            // Update the zustand store
            set({
                accessToken: access,
                refreshToken: refresh,
                user: user,
                isAuthenticated: true
            });
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    },

    // Action to refresh the token (using refreshTokenService)
    refreshToken: async () => {
        try {
            const newAccessToken = await refreshTokenService();  // Using the refreshTokenService function

            // Update access token in Zustand store and localStorage
            set({ accessToken: newAccessToken });
            return newAccessToken;
        } catch (error) {
            console.error('Token refresh error:', error);
            return null;
        }
    },

    // Action to logout
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        set({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            user: null,
        });

        // Redirect to login page after logout
        window.location.href = '/login';
    },
}));

export default useAuthStore;
