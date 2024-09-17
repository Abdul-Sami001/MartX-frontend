import { create } from 'zustand';

const useCartStore = create((set) => ({
    cartId: null,
    cartItems: [],

    // Set cart details locally (used after fetching via React Query)
    setCart: (cartId, cartItems) => set({ cartId, cartItems }),

    // Add an item locally to the cart state
    addItemLocally: (newItem) => set((state) => ({
        cartItems: [...state.cartItems, newItem],
    })),

    // Update an existing cart item locally
    updateItemLocally: (updatedItem) => set((state) => ({
        cartItems: state.cartItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    })),

    // Remove an item locally from the cart state
    removeItemLocally: (itemId) => set((state) => ({
        cartItems: state.cartItems.filter((item) => item.id !== itemId),
    })),
}));

export default useCartStore;
