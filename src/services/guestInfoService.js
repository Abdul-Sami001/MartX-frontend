import axios from 'axios';

// Utility function for guest checkout
export const handleGuestCheckout = async (guestInfo, productId, quantity, setLoading, toast, navigate) => {
    setLoading(true);  // Show loading state

    try {
        const cartId = localStorage.getItem('cartId');  // If applicable, get cartId (optional)

        // Step 1: Create the order for the guest user
        const orderResponse = await axios.post('http://127.0.0.1:8000/store/orders/', {
            name: guestInfo.name,
            email: guestInfo.email,
            address: guestInfo.address,
            city: guestInfo.city,
            country: guestInfo.country,
            postal_code: guestInfo.postal_code,
            cart_id: cartId,  // If using a cart (optional)
            product_id: productId,  // Use if purchasing a single product
            quantity: quantity  // Include quantity for single product
        });

        const createdOrderId = orderResponse.data.id;

        // Step 2: Proceed with Stripe payment using the clientSecret
        const paymentIntentResponse = await axios.post('http://127.0.0.1:8000/create-payment-intent/', {
            order_id: createdOrderId,  // Pass the created order ID to generate payment intent
        });

        const { clientSecret } = paymentIntentResponse.data;

        // Save the order ID and payment intent in localStorage for future use
        localStorage.setItem('orderId', createdOrderId);
        localStorage.setItem('clientSecret', clientSecret);

        // Redirect the guest user to the checkout page for payment
        navigate(`/checkout/${createdOrderId}`);
    } catch (error) {
        console.error('Error during guest checkout:', error);
        toast({
            title: 'Checkout Failed',
            description: error.message || 'Something went wrong during checkout.',
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    } finally {
        setLoading(false);  // Turn off loading state
    }
};
