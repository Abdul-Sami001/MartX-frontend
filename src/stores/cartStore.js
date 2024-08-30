import { create } from 'zustand';
import axios from 'axios';

const useCartStore = create((set, get) => ({
    cartId: null,
    cartItems: [],  // Ensure this is initialized as an array

    initializeCart: async () => {
        try {
            let storedCartId = localStorage.getItem('cartId');
            if (!storedCartId) {
                // Create a new cart if none exists
                const { data: newCart } = await axios.post('http://127.0.0.1:8000/store/carts/');
                storedCartId = newCart.id;
                localStorage.setItem('cartId', storedCartId);
            }
            // Fetch the cart details
            const { data: cartDetails } = await axios.get(`http://127.0.0.1:8000/store/carts/${storedCartId}/`);

            // Fetch full product details for items that have only product_id
            const updatedCartItems = await Promise.all(
                cartDetails.items.map(async (item) => {
                    if (item.product_id && !item.product) {
                        // Fetch the product details
                        const { data: product } = await axios.get(`http://127.0.0.1:8000/store/products/${item.product_id}/`);
                        return { ...item, product };
                    }
                    return item;
                })
            );

            set({
                cartId: storedCartId,
                cartItems: updatedCartItems  // Ensure cartItems are fully populated
            });
        } catch (error) {
            console.error('Error initializing cart:', error);
            set({ cartId: null, cartItems: [] });  // Reset on error
            localStorage.removeItem('cartId');
        }
    },

    addToCart: async (product) => {
        const cartId = get().cartId;
        const cartItems = get().cartItems;

        if (!cartId || !product) return;

        try {
            const existingItem = cartItems.find(item => item.product?.id === product.id);
            if (existingItem) {
                const { data: updatedItem } = await axios.patch(`http://127.0.0.1:8000/store/carts/${cartId}/items/${existingItem.id}/`, {
                    quantity: existingItem.quantity + 1,
                });
                set({
                    cartItems: cartItems.map(item => item.id === updatedItem.id ? updatedItem : item)
                });
            } else {
                const { data: newItem } = await axios.post(`http://127.0.0.1:8000/store/carts/${cartId}/items/`, {
                    product_id: product.id,
                    quantity: 1,
                });

                // Fetch the full product details to avoid partial data issues
                const { data: productDetails } = await axios.get(`http://127.0.0.1:8000/store/products/${product.id}/`);
                set({
                    cartItems: [...cartItems, { ...newItem, product: productDetails }]
                });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    },

    updateQuantity: async (itemId, quantity) => {
        const cartId = get().cartId;
        const cartItems = get().cartItems;

        if (!cartId || !itemId || quantity < 1) return;

        try {
            const { data: updatedItem } = await axios.patch(`http://127.0.0.1:8000/store/carts/${cartId}/items/${itemId}/`, { quantity });
            set({
                cartItems: cartItems.map(item => item.id === updatedItem.id ? updatedItem : item)
            });
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    },

    removeFromCart: async (itemId) => {
        const cartId = get().cartId;
        if (!cartId || !itemId) return;

        try {
            await axios.delete(`http://127.0.0.1:8000/store/carts/${cartId}/items/${itemId}/`);
            set({
                cartItems: get().cartItems.filter(item => item.id !== itemId)
            });
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    }
}));

export default useCartStore;
