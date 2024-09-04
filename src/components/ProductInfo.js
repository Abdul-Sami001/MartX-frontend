import React, { useState } from 'react';
import { Box, Text, Select, Button, Flex, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react';
import axios from 'axios';
import PaymentComponent from './PaymentComponent';  // Import the payment component

const ProductInfo = ({ product }) => {
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);  // Store orderId once order is created
    const [clientSecret, setClientSecret] = useState(null);  // Store clientSecret for Stripe payment

    const handleBuyNow = async () => {
        setLoading(true);

        try {
            const cartId = localStorage.getItem('cartId');
            const userId = 1; // Manually add `user_id` for testing purposes

            if (!cartId) {
                throw new Error('Cart ID not found. Please add items to the cart first.');
            }

            // Step 1: Create an order by sending cart_id and user_id
            const orderResponse = await axios.post('http://127.0.0.1:8000/store/orders/', {
                cart_id: cartId,
                user_id: userId, // Pass the user_id here for testing
            });

            const { id: createdOrderId } = orderResponse.data;
            setOrderId(createdOrderId);  // Store the created order ID
            console.log('Order created with ID:', createdOrderId);

            // Step 2: Request payment intent for the order
            const paymentIntentResponse = await axios.post('http://127.0.0.1:8000/create-payment-intent/', {
                order_id: createdOrderId,  // Pass the order ID to get the payment intent
            });

            const { clientSecret } = paymentIntentResponse.data;
            setClientSecret(clientSecret);  // Store the client secret for Stripe
            console.log('Payment intent created with clientSecret:', clientSecret);
        } catch (error) {
            console.error('Error during payment:', error);
            alert('Error during payment: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={4}>
            <Text fontSize="2xl" fontWeight="bold" mb={2}>{product.title}</Text>
            <Text fontSize="lg" color="gray.600" mb={4}>Price: Rs {product.price_with_tax.toFixed(2)}</Text>
            <Text fontSize="md" color="gray.600" mb={4}>{product.description}</Text>

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
                <Button colorScheme="gray" size="lg" isLoading={loading} onClick={handleBuyNow}>Buy Now</Button>
            </Flex>

            {/* Render PaymentComponent once the clientSecret is created */}
            {clientSecret && <PaymentComponent clientSecret={clientSecret} />}
        </Box>
    );
};

export default ProductInfo;
