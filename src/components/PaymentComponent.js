import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Box, Button, Text } from '@chakra-ui/react';

const PaymentComponent = ({ clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            setError("Stripe is not loaded or payment intent isn't set");
            return;
        }

        setLoading(true);
        const cardElement = elements.getElement(CardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: 'Customer Name',  // Replace with actual customer details
                },
            },
        });

        if (error) {
            setError(`Payment failed: ${error.message}`);
        } else {
            setError(null);
            alert('Payment successful!');
            // Handle post-payment actions like redirecting to a confirmation page
        }

        setLoading(false);
    };

    return (
        <Box>
            <form onSubmit={handlePaymentSubmit}>
                <CardElement />
                <Button type="submit" colorScheme="orange" disabled={!stripe || !clientSecret || loading}>
                    {loading ? 'Processing...' : 'Pay Now'}
                </Button>
            </form>
            {error && <Text color="red.500">{error}</Text>}
        </Box>
    );
};

export default PaymentComponent;
