// store/vendorOrderStore.js
import { create } from 'zustand';
import axios from 'axios';
import api from '../services/authInterceptor';

const useVendorOrderStore = create((set) => ({
    orders: [],
    loading: false,
    error: null,

    fetchVendorOrders: async (token) => {
        set({ loading: true });
        try {
            const response = await api.get('http://localhost:8000/store/vendor/orders/', {
               
            });
            set({ orders: response.data, loading: false });
        } catch (error) {
            console.error('Error fetching orders:', error);
            set({ error: 'Failed to load orders', loading: false });
        }
    },

    updateOrderStatus: async (orderId, status, token) => {
        try {
            await api.patch(
                `http://localhost:8000/store/vendor/orders/${orderId}/update_status/`,
                { status },
                
            );
            // Update the status in the local state after a successful API response
            set((state) => ({
                orders: state.orders.map((order) =>
                    order.id === orderId ? { ...order, payment_status: status } : order
                ),
            }));
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    },
}));

export default useVendorOrderStore;
