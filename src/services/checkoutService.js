import axios from 'axios';
import api from './authInterceptor';  // For authenticated API calls
import { navigate } from 'react-router-dom';  // Assuming you're using react-router-dom for navigation

// Utility function for handling checkout
export const handleCheckout = async (cartId, userInfo, setLoading, toast, navigate) => {
    setLoading(true);  // Show loading state while processing

    try {
        const accessToken = localStorage.getItem('accessToken');  // For authenticated users
        const refreshToken = localStorage.getItem('refreshToken');  // Refresh token (if applicable)

        if (!cartId) {
            throw new Error('Cart ID not found. Please add items to the cart first.');
        }

        let orderResponse = null;
        let createdOrderId;

        // If the user is authenticated
        if (accessToken) {
            console.log('Authenticated User - Cart ID:', cartId);
            try {
                // Step 1: Create order for the full cart (Authenticated User)
                orderResponse = await api.post('http://127.0.0.1:8000/store/orders/', {
                    cart_id: cartId,  // Send the cart ID to create an order for all cart items
                });
                createdOrderId = orderResponse.data.id;
            } catch (error) {
                if (error.response && error.response.status === 401 && refreshToken) {
                    // If the access token is expired, refresh it
                    const tokenResponse = await api.post('http://127.0.0.1:8000/auth/refresh-token/', {
                        refresh_token: refreshToken,
                    });
                    const newAccessToken = tokenResponse.data.accessToken;
                    localStorage.setItem('accessToken', newAccessToken);

                    // Retry the order creation with the new token
                    orderResponse = await api.post('http://127.0.0.1:8000/store/orders/', {
                        cart_id: cartId,
                    });
                    createdOrderId = orderResponse.data.id;
                } else {
                    throw new Error('Failed to create order for authenticated user.');
                }
            }
        } else {
            // If the user is unauthenticated, handle guest checkout
            console.log('Guest User - Cart ID:', cartId);
            orderResponse = await axios.post('http://127.0.0.1:8000/store/orders/', {
                ...userInfo,  // Include guest information (name, email, etc.)
                cart_id: cartId,
            });
            createdOrderId = orderResponse.data.id;
        }

        // Step 2: Proceed with Stripe payment using the clientSecret
        const paymentIntentResponse = await axios.post('http://127.0.0.1:8000/create-payment-intent/', {
            order_id: createdOrderId,  // Send the created order ID to generate the payment intent
        });

        const { clientSecret } = paymentIntentResponse.data;

        // Save the order ID and payment intent in localStorage for later use
        localStorage.setItem('orderId', createdOrderId);
        localStorage.setItem('clientSecret', clientSecret);

        // Redirect to the payment page (e.g., Stripe payment page)
        navigate(`/checkout/${createdOrderId}`);  // Redirect user to the checkout page
    } catch (error) {
        console.error('Error during checkout:', error);
        toast({
            title: 'Checkout Failed',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    } finally {
        setLoading(false);  // Turn off loading state
    }
};
