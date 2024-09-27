import { create } from 'zustand';
import axios from 'axios';

const useInventoryStore = create((set) => ({
    inventory: {},
    loading: false,

    fetchInventory: async (productId) => {
        set({ loading: true });
        try {
            const { data } = await axios.get(`/store/products/${productId}/inventory`);
            set((state) => ({ inventory: { ...state.inventory, [productId]: data.stock }, loading: false }));
        } catch (error) {
            set({ loading: false });
        }
    },

    setInventory: (productId, stockLevel) => set((state) => ({ inventory: { ...state.inventory, [productId]: stockLevel } })),
}));

export default useInventoryStore;
