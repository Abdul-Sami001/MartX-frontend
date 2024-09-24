import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Text, Select, Button, Flex, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';  // React Query v5 hook
import { createOrder, createPaymentIntent } from '../services/checkoutService';  // Import service functions
import { useToast } from '@chakra-ui/react';  // Import toast for notifications
import GuestInfoModal from '../components/GuestInfoModal';  // Assume you have this modal for guest info

const ProductInfo = ({ product }) => {
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isGuestCheckout, setIsGuestCheckout] = useState(false);  // Track guest checkout flow
    const [guestInfo, setGuestInfo] = useState({});  // Store guest information
    const navigate = useNavigate();  // For redirecting after order creation
    const toast = useToast();  // To show notifications

    // Step 1: Create mutations for order and payment intent
    const createOrderMutation = useMutation({
        mutationFn: createOrder,  // Pass the mutation function directly
        onError: (error) => {
            console.error('Error creating order:', error);
            toast({
                title: 'Error',
                description: 'Failed to create order. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
        },
    });

    const createPaymentIntentMutation = useMutation({
        mutationFn: createPaymentIntent,  // Pass the mutation function directly
        onError: (error) => {
            console.error('Error creating payment intent:', error);
            toast({
                title: 'Payment Failed',
                description: 'Something went wrong with payment.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
        },
    });

    // Step 2: Handle Buy Now click
    const handleBuyNowClick = async () => {
        setLoading(true);  // Show loading spinner

        const accessToken = localStorage.getItem('accessToken');  // Check if user is authenticated

        // If user is not authenticated, show the guest info modal
        if (!accessToken) {
            setIsGuestCheckout(true);  // Show guest modal
            setLoading(false);
            return;
        }

        // Authenticated flow
        try {
            // Step 1: Create the order
            const { orderId } = await createOrderMutation.mutateAsync({
                productId: product.id,
                quantity,
                userInfo: null  // For authenticated users, no need for guest info
            });

            // Step 2: Create the payment intent for the order
            //const clientSecret = await createPaymentIntentMutation.mutateAsync({ orderId });

            // Redirect to the payment page
            navigate(`/checkout/${orderId}`);  // Redirect to checkout page

        } catch (error) {
            console.error('Error during Buy Now:', error);
        } finally {
            setLoading(false);  // Stop loading spinner
        }
    };

    // Handle guest checkout submission (from the modal)
    const handleGuestSubmit = async (guestInfo) => {
        setLoading(true);
        setIsGuestCheckout(false);  // Close the guest modal

        try {

            let createdOrderId = localStorage.getItem('orderId');
            let orderId = createdOrderId;
            // Save the guest info to localStorage for pre-populating on checkout page
            localStorage.setItem('guestInfo', JSON.stringify(guestInfo));
            if (!createdOrderId) {
                // Step 1: Create the order with guest info
                const orderData = await createOrderMutation.mutateAsync({
                    productId: product.id,
                    quantity,
                    userInfo: guestInfo  // Include guest information
                });
                orderId = orderData.orderId;
                localStorage.setItem('orderId', orderId);

            }
            // Step 2: Create the payment intent for the order
           // const clientSecret = await createPaymentIntentMutation.mutateAsync({ orderId });

            // Redirect to the payment page
            navigate(`/checkout/${orderId}`);

        } catch (error) {
            console.error('Error during guest checkout:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={4}>
            <Text fontSize="2xl" fontWeight="bold" mb={2}>{product.title}</Text>
            <Text fontSize="lg" color="gray.600" mb={4}>Price: Rs {product.price_with_tax.toFixed(2)}</Text>
            <Text fontSize="md" color="gray.600" mb={4}>{product.description}</Text>

            {/* Additional product fields like size, color */}
            <Select placeholder="Select Size" mb={3} onChange={(e) => setSize(e.target.value)}>
                <option value="size8">Size 8</option>
                <option value="size9">Size 9</option>
                <option value="size10">Size 10</option>
            </Select>

            <Select placeholder="Select Color" mb={3} onChange={(e) => setColor(e.target.value)}>
                <option value="white">White</option>
                <option value="black">Black</option>
            </Select>

            <Flex gap={4} alignItems="center" mb={4}>
                <Text fontWeight="bold">Quantity:</Text>
                {/* Same logic for quantity input as in CartDrawer */}
                <NumberInput min={1} defaultValue={1} value={quantity} onChange={(value) => setQuantity(parseInt(value))}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </Flex>

            <Flex gap={4}>
                <Button colorScheme="orange" size="lg">Add to Cart</Button>
                <Button colorScheme="gray" size="lg" isLoading={loading} onClick={handleBuyNowClick}>Buy Now</Button>
            </Flex>

            {/* Guest Checkout Modal */}
            {isGuestCheckout && (
                <GuestInfoModal
                    isOpen={isGuestCheckout}
                    onClose={() => setIsGuestCheckout(false)}
                    handleGuestSubmit={handleGuestSubmit}
                />
            )}
        </Box>
    );
};

export default ProductInfo;
