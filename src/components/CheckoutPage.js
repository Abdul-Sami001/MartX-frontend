import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Box, VStack, Heading, FormControl, FormLabel, Input, Button, Text, useToast } from '@chakra-ui/react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import api from '../services/authInterceptor';  // Use the configured axios instance
import axios from 'axios';

export default function CheckoutPage() {
    const { orderId } = useParams();  // Get the dynamic order ID from URL parameters
    const [clientSecret, setClientSecret] = useState('');  // For storing the Stripe client secret
    const [loading, setLoading] = useState(false);  // Handle loading state during payment process
    const [userInfo, setUserInfo] = useState({  // Store user billing info
        name: '',
        email: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
    });
    const navigate = useNavigate();
    const stripe = useStripe();  // Stripe instance for payment processing
    const elements = useElements();  // Access Stripe's card elements
    const toast = useToast();  // Toast notifications for feedback

    // Populate fields with guest information from localStorage (if available)
    useEffect(() => {
        const guestInfo = JSON.parse(localStorage.getItem('guestInfo'));  // Retrieve guest info from localStorage
        if (guestInfo) {
            setUserInfo({
                name: guestInfo.name || '',
                email: guestInfo.email || '',
                address: guestInfo.address || '',
                city: guestInfo.city || '',
                country: guestInfo.country || '',
                postalCode: guestInfo.postal_code || '',
            });
        }
    }, []);  // Only run this effect once when the component mounts

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({ ...prev, [name]: value }));
    };

    // Handle the submission of the payment form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Ensure Stripe and elements are ready
            if (!stripe || !elements) {
                throw new Error('Stripe is not initialized.');
            }

            const cardElement = elements.getElement(CardElement);
            let createdOrderId;
            let orderResponse = null;
            const existingOrderId = localStorage.getItem('orderId');  // Get orderId from localStorage
            const accessToken = localStorage.getItem('accessToken');  // Retrieve access token for authenticated users
            const cartId = localStorage.getItem('cartId');  // Retrieve cart ID

            if (!cartId) {
                throw new Error('Cart ID not found. Please add items to the cart first.');
            }

            // Check if an order already exists in localStorage
            if (existingOrderId) {
                createdOrderId = existingOrderId;
                console.log('Using existing order with ID:', createdOrderId);

                // If the user is authenticated (i.e., accessToken exists), fetch the existing order details
                if (accessToken) {
                    try {
                        const existingOrderResponse = await api.get(`/store/orders/${createdOrderId}/`);
                        orderResponse = existingOrderResponse.data;
                    } catch (error) {
                        console.error('Error fetching existing order:', error);
                        throw error;  // Handle token refresh in authInterceptor
                    }
                } else {
                    console.log('Unauthenticated user cannot fetch existing orders from the API.');
                }
            } else {
                // Step 1: Send guest information to the backend and create the order
                orderResponse = await axios.post('http://127.0.0.1:8000/store/orders/', {
                    name: userInfo.name,
                    email: userInfo.email,
                    address: userInfo.address,
                    city: userInfo.city,
                    country: userInfo.country,
                    postal_code: userInfo.postalCode,
                    cart_id: cartId,
                });

                createdOrderId = orderResponse.data.id;
                localStorage.setItem('orderId', createdOrderId);  // Save the order ID to avoid re-creating it
                console.log('Order created with ID:', createdOrderId);
            }

            // Step 2: Proceed with Stripe payment using the clientSecret
            const paymentIntentResponse = await axios.post('http://127.0.0.1:8000/create-payment-intent/', {
                order_id: createdOrderId,  // Pass the order ID to get the payment intent
            });

            const { clientSecret } = paymentIntentResponse.data;
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: userInfo.name,
                        email: userInfo.email,
                        address: {
                            line1: userInfo.address,
                            city: userInfo.city,
                            country: userInfo.country,
                            postal_code: userInfo.postalCode,
                        },
                    },
                },
            });

            if (error) {
                throw new Error(error.message);
            }

            // Notify user of successful payment
            toast({
                title: 'Payment Successful',
                description: `Payment ID: ${paymentIntent.id}`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            // Save order details in localStorage for guest users (optional)
            localStorage.setItem('guestOrderId', createdOrderId);
            localStorage.setItem('guestEmail', userInfo.email);

            // Redirect guest user to the guest order confirmation page
            navigate(`/guest-order-confirmation/${createdOrderId}`);  // Redirect guest to their order details page

        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error);  // Display validation error (e.g., payment already completed)
            } else {
                toast({
                    title: 'Payment Failed',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
            console.error('Order creation failed:', error);  // Log any error for better debugging
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth="500px" margin="auto" padding={8}>
            <VStack spacing={6} as="form" onSubmit={handleSubmit}>
                <Heading as="h1" size="xl">Checkout</Heading>

                {/* User Information Inputs */}
                <FormControl isRequired>
                    <FormLabel htmlFor="name">Full Name</FormLabel>
                    <Input id="name" name="name" value={userInfo.name} onChange={handleInputChange} />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input id="email" name="email" type="email" value={userInfo.email} onChange={handleInputChange} />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel htmlFor="address">Address</FormLabel>
                    <Input id="address" name="address" value={userInfo.address} onChange={handleInputChange} />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel htmlFor="city">City</FormLabel>
                    <Input id="city" name="city" value={userInfo.city} onChange={handleInputChange} />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel htmlFor="country">Country</FormLabel>
                    <Input id="country" name="country" value={userInfo.country} onChange={handleInputChange} />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel htmlFor="postalCode">Postal Code</FormLabel>
                    <Input id="postalCode" name="postalCode" value={userInfo.postalCode} onChange={handleInputChange} />
                </FormControl>

                {/* Stripe Card Element */}
                <FormControl isRequired>
                    <FormLabel htmlFor="card-element">Credit or Debit Card</FormLabel>
                    <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={3}>
                        <CardElement id="card-element" />
                    </Box>
                </FormControl>

                {/* Pay Now Button */}
                <Button type="submit" colorScheme="blue" isLoading={loading} loadingText="Processing" width="full">
                    Pay Now
                </Button>
            </VStack>
        </Box>
    );
}
