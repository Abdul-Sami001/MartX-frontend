import axios from 'axios';
import api from './authInterceptor';  // For authenticated API calls

export const handleBuyNow = async (productId, quantity = 1, userInfo, setLoading, toast, navigate) => {
    setLoading(true);  // Show loading state while processing

    try {
        const accessToken = localStorage.getItem('accessToken');  // For authenticated users
        const refreshToken = localStorage.getItem('refreshToken');  // Refresh token (if applicable)
        let orderResponse = null;
        let createdOrderId = null;

        // Check if the user is authenticated
        if (accessToken) {
            try {
                // Step 1: Create order for the individual product (authenticated)
                orderResponse = await api.post('http://127.0.0.1:8000/store/orders/', {
                    product_id: productId,
                    quantity: quantity,  // Default quantity of 1
                });
                createdOrderId = orderResponse.data.id;
            } catch (error) {
                if (error.response && error.response.status === 401 && refreshToken) {
                    // If access token is expired, refresh it
                    const tokenResponse = await api.post('http://127.0.0.1:8000/auth/refresh-token/', {
                        refresh_token: refreshToken,
                    });
                    const newAccessToken = tokenResponse.data.accessToken;
                    localStorage.setItem('accessToken', newAccessToken);

                    // Retry the order creation with the new token
                    orderResponse = await api.post('http://127.0.0.1:8000/store/orders/', {
                        product_id: productId,
                        quantity: quantity,
                    });
                    createdOrderId = orderResponse.data.id;
                } else {
                    throw new Error('Failed to create order for authenticated user.');
                }
            }
        } else {
            // Step 1: Create order for the individual product (unauthenticated/guest)
            if (!userInfo || !userInfo.name || !userInfo.email) {
                throw new Error("Guest user information (name, email, etc.) is missing.");
            }

            orderResponse = await axios.post('http://127.0.0.1:8000/store/orders/', {
                ...userInfo,  // Include guest information (name, email, etc.)
                product_id: productId,
                quantity: quantity,
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

        // Redirect to payment page (or handle payment flow immediately)
        navigate(`/checkout/${createdOrderId}`);  // Redirect user to the checkout page

    } catch (error) {
        console.error('Error during Buy Now:', error);
        toast({
            title: 'Error',
            description: 'Failed to process the order. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    } finally {
        setLoading(false);
    }
};
