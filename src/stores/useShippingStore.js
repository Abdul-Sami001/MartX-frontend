import { create } from 'zustand';

const useShippingStore = create((set) => ({
    shippingOptions: [],
    selectedShipping: null,
    deliveryAddress: null,

    fetchShippingOptions: async () => {
        const { data } = await axios.get('/store/shipping-options');
        set({ shippingOptions: data });
    },

    setShippingOption: (option) => set({ selectedShipping: option }),

    setDeliveryAddress: (address) => set({ deliveryAddress: address }),
}));

export default useShippingStore;
