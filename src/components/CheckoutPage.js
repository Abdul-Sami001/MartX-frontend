import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, VStack, Heading, FormControl, FormLabel, Input, Button, Text, useToast, Toast } from '@chakra-ui/react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';  // React Query for mutations
import { createOrder, createPaymentIntent } from '../services/checkoutService';  // Updated services
import { toast } from 'react-toastify';
export default function CheckoutPage() {
   
    const [loading, setLoading] = useState(false);  // Handle loading state during payment process
    const [userInfo, setUserInfo] = useState({  // Store user billing info
        name: '',
        email: '',
        address: '',
        city: '',
        country: '',
        postal_code: '',
    });
    const toast = useToast();  // Toast notifications for feedback
    const navigate = useNavigate();
    const stripe = useStripe();  // Stripe instance for payment processing
    const elements = useElements();  // Access Stripe's card elements

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
                postal_code: guestInfo.postal_code || '',
            });
        }
    }, []);  // Only run this effect once when the component mounts

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({ ...prev, [name]: value }));
    };

    // React Query Mutations for order creation and payment intent
    const createOrderMutation = useMutation({
        mutationFn: async () => {
            const cartId = localStorage.getItem('cartId');  // Retrieve cart ID
           
            if (!cartId) {
                throw new Error('Cart ID not found. Please add items to the cart first.');
            }
    
            return createOrder({ cartId, userInfo });  // Call createOrder from the service
        },
        onError: (error) => {
            console.error('Order creation failed:', error);
            toast({
                title: 'Order Creation Failed',
                description: error.message || 'Something went wrong.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
        }
    });

    const createPaymentIntentMutation = useMutation({
        mutationFn: async (orderId) => {
            return createPaymentIntent({ orderId });  // Call createPaymentIntent from the service
        },
        onError: (error) => {
            console.error('Payment Intent creation failed:', error);
            toast({
                title: 'Payment Failed',
                description: error.message || 'Something went wrong with payment.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
        }
    });

    // Handle the submission of the payment form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Ensure Stripe and elements are ready
            if (!stripe || !elements) {
                throw new Error('Stripe is not initialized.');
            }
            //recomment the below line if it not work properly
            // Step 1: Create or retrieve the order
            let orderId = localStorage.getItem('orderId'); 
            if (!orderId) {
                const orderData = await createOrderMutation.mutateAsync();  // Create a new order
                orderId = orderData.orderId;  // Extract orderId from the response
                localStorage.setItem('orderId', orderId);  // Save the new orderId in localStorage
            
            }
            console.log("created order Id Checkout Page", orderId); // Save the order ID to avoid re-creating it

            // Step 2: Create Payment Intent for the order
            const clientSecret = await createPaymentIntentMutation.mutateAsync( orderId );

            // Step 3: Confirm the payment using Stripe
            const cardElement = elements.getElement(CardElement);
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

            // Save order details for guest users
            localStorage.removeItem('orderId');
            //localStorage.setItem('guestOrderId', createdOrderId);
            localStorage.setItem('guestEmail', userInfo.email);

            // Redirect guest user to the guest order confirmation page
            
            navigate(`/guest-order-confirmation/${orderId}`);

        } catch (error) {
            toast({
                title: 'Payment Failed',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            console.error('Payment failed:', error);  // Log any error for better debugging
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
                    <Input id="postalCode" name="postalCode" value={userInfo.postal} onChange={handleInputChange} />
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
