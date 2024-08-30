// import axios from 'axios';

// const API_BASE_URL = 'http://127.0.0.1:8000/store';

// const getAuthToken = () => {
//     return localStorage.getItem('accessToken');
// };

// export const fetchProducts = async (url = `${API_BASE_URL}/products/`) => {
//     try {
//         const token = getAuthToken();
//         const response = await axios.get(url, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         const { data } = response;
//         return {
//             products: data.results,
//             nextPage: data.next,
//             previousPage: data.previous
//         };
//     } catch (error) {
//         if (error.response && error.response.status === 401) {
//             alert('Your session has expired. Please log in again.');
//             window.location.href = '/login';
//         } else {
//             console.error("Failed to fetch products:", error);
//             throw error;
//         }
//     }
// };

// export const createCart = async () => {
//     try {
//         const token = getAuthToken();
//         const response = await axios.post(`${API_BASE_URL}/carts/`, {}, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         console.log(`this should be uuid:${response.data.uuid}`);
//         return response.data;  // Assuming the response contains the cart object with its UUID
//     } catch (error) {
//         console.error("Failed to create a new cart:", error);
//         throw error;
//     }
// };

// // Fetch cart items
// export const fetchCart = async (cartId) => {
//     try {
//         const token = getAuthToken();
//         const response = await axios.get(`${API_BASE_URL}/carts/${cartId}/`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         console.log(response.data);
//         return response.data;
//     } catch (error) {
//         console.error("Failed to fetch cart:", error);
//         throw error;
//     }
// };



// // Add an item to the cart
// export const addToCart = async (cartId, productId, quantity = 1) => {
//     try {
//         const token = getAuthToken();
//         const response = await axios.post(
//             `${API_BASE_URL}/carts/${cartId}/items/`,
//             { product_id: productId, quantity },
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );
//         return response.data;
//     } catch (error) {
//         console.error("Failed to add item to cart:", error);
//         throw error;
//     }
// };

// // Update an item in the cart
// export const updateCartItem = async (cartId, itemId, quantity) => {
//     try {
//         const token = getAuthToken();
//         const response = await axios.patch(
//             `${API_BASE_URL}/carts/${cartId}/items/${itemId}/`,
//             { quantity },
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );
//         return response.data;
//     } catch (error) {
//         console.error("Failed to update cart item:", error);
//         throw error;
//     }
// };

// // Remove an item from the cart
// export const removeCartItem = async (cartId, itemId) => {
//     try {
//         const token = getAuthToken();
//         await axios.delete(`${API_BASE_URL}/carts/${cartId}/items/${itemId}/`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//     } catch (error) {
//         console.error("Failed to remove item from cart:", error);
//         throw error;
//     }
// };
