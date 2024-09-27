import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// Product Store
const useProductStore = create(
    persist(
        (set) => ({
            products: [],  // Store fetched products
            loading: false,  // Loading state
            error: null,  // Error state

            // Fetch products from the API
            fetchProducts: async (filters) => {
                set({ loading: true, error: null });

                try {
                    const { data } = await axios.get(`http://127.0.0.1:8000/store/products/`, { params: filters });
                    set({ products: data.results, loading: false });
                } catch (error) {
                    set({ error: 'Failed to fetch products', loading: false });
                }
            },
        }),
        {
            name: 'product-storage',  // Name for localStorage persistence (optional)
            getStorage: () => localStorage,  // Persist store data in localStorage
        }
    )
);

export default useProductStore;
