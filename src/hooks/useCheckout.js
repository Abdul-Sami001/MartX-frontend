import { useMutation } from '@tanstack/react-query';
import { createOrder, createPaymentIntent } from '../services/checkoutService';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const useCheckout = () => {
    const toast = useToast();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: async ({ cartId, userInfo }) => {
            // Step 1: Create the order
            const orderId = await createOrder(cartId, userInfo);

            if (!orderId) {
                throw new Error('Order creation failed. Please try again.');
            }

            // Step 2: Create a payment intent for the order
            const clientSecret = await createPaymentIntent(orderId);

            if (!clientSecret) {
                throw new Error('Failed to create payment intent. Please try again.');
            }

            // Step 3: Save order details and redirect to payment page
            localStorage.setItem('orderId', orderId);
            localStorage.setItem('clientSecret', clientSecret);
            navigate(`/checkout/${orderId}`);
        },
        onSuccess: () => {
            toast({
                title: 'Order Created',
                description: 'Redirecting to payment...',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        },
        onError: (error) => {
            toast({
                title: 'Checkout Failed',
                description: error.message || 'Something went wrong. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        },
    });

    return mutation;
};
