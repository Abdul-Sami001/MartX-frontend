import axios from 'axios';
import api from './authInterceptor';  // For authenticated API calls

// Create an order (authenticated or guest)
export const createOrder = async (cartId, userInfo = null) => {
    const accessToken = localStorage.getItem('accessToken');  // Check for user token
    const refreshToken = localStorage.getItem('refreshToken');  // Token for refresh
    let createdOrderId = null;
    let orderResponse = null;

    // Authenticated user
    if (accessToken) {
        try {
            orderResponse = await api.post('http://127.0.0.1:8000/store/orders/', {
                cart_id: cartId,  // Send the cart ID to create the order
            });
            createdOrderId = orderResponse.data.id;
        } catch (error) {
            if (error.response && error.response.status === 401 && refreshToken) {
                // Token expired, refresh token
                const tokenResponse = await api.post('http://127.0.0.1:8000/auth/refresh-token/', {
                    refresh_token: refreshToken,
                });
                const newAccessToken = tokenResponse.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);

                // Retry order creation
                orderResponse = await api.post('http://127.0.0.1:8000/store/orders/', {
                    cart_id: cartId,
                });
                createdOrderId = orderResponse.data.id;
            } else {
                throw new Error('Failed to create order for authenticated user.');
            }
        }
    } else {
        // Guest user
        orderResponse = await axios.post('http://127.0.0.1:8000/store/orders/', {
            ...userInfo,  // Guest user details
            cart_id: cartId,
        });
        createdOrderId = orderResponse.data.id;
    }

    return createdOrderId;
};

// Create payment intent (Stripe or any other payment gateway)
export const createPaymentIntent = async (orderId) => {
    const response = await axios.post('http://127.0.0.1:8000/create-payment-intent/', {
        order_id: orderId,
    });
    return response.data.clientSecret;
};
