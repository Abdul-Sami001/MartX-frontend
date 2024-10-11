// store/userStore.js
import { create } from 'zustand';
import axios from 'axios';
import api from '../services/authInterceptor';

const useUserStore = create((set) => ({
    user: null,
    loading: false,
    error: null,

    fetchUser: async (token) => {
        set({ loading: true });
        try {
            const response = await api.get('http://localhost:8000/auth/users/me/', {
               
            });
            set({ user: response.data, loading: false });
        } catch (error) {
            console.error('Error fetching user data:', error);
            set({ error: error.message, loading: false });
        }
    },

    updateUser: async (token, updatedUserData) => {
        try {
            await api.patch('http://localhost:8000/auth/users/me/', updatedUserData, {
               
            });
            set({ user: updatedUserData });
            return true;
        } catch (error) {
            console.error('Error updating user data:', error);
            set({ error: error.message });
            return false;
        }
    },
}));

export default useUserStore;
