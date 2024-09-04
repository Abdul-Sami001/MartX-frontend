import { create } from 'zustand';
import { loginService, logoutService } from '../services/authService'; // Assuming you have a logoutService
import axios from 'axios';

const useAuthStore = create((set) => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    userInfo: null,
    error: null,

    login: async (credentials) => {
        try {
            let newCredentials = {
                username: credentials.email,
                password: credentials.password,
            }
            console.log('credentials', newCredentials)
            const data = await loginService(newCredentials);
            localStorage.setItem('accessToken', data.access);  // Store access token
            localStorage.setItem('refreshToken', data.refresh); // Store refresh token

            set({
                accessToken: data.access,
                refreshToken: data.refresh,
                isAuthenticated: true,
                error: null,
            });
        } catch (err) {
            set({ error: err.message });
        }
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        set({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            userInfo: null,
        });

        // Call logout service if required (e.g., to invalidate tokens on the backend)
        logoutService();
    },

    fetchUserInfo: async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const response = await axios.get('http://127.0.0.1:8000/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                set({ userInfo: response.data });
            }
        } catch (err) {
            console.error('Failed to fetch user info:', err);
        }
    },
}));

export default useAuthStore;
