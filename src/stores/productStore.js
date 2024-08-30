// productStore.js
import { create } from 'zustand';
import axios from 'axios';

const useProductStore = create((set) => ({
    products: [],
    loading: false,

    fetchProducts: async () => {
        set({ loading: true });
        try {
            const { data } = await axios.get('http://127.0.0.1:8000/store/products/');
            set({ products: data.results }); // Assuming the API response is paginated with a 'results' key
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            set({ loading: false });
        }
    }
}));

export default useProductStore;
