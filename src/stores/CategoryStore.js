import { create } from 'zustand';
import axios from 'axios';

const useCategoryStore = create((set) => ({
    categories: [],
    loading: false,
    error: null,

    // Action to fetch categories from backend
    fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('http://127.0.0.1:8000/store/collections/');
            set({ categories: response.data, loading: false });
        } catch (error) {
            set({ error: 'Failed to fetch categories', loading: false });
        }
    }
}));

export default useCategoryStore;
