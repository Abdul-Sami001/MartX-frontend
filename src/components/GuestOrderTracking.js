import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Box, FormControl, FormLabel, Input, Button, Text } from '@chakra-ui/react';
import axios from 'axios';

const fetchGuestOrder = async ({ email, orderId }) => {
    const response = await axios.post('http://127.0.0.1:8000/store/orders/guest-order/', { email, order_id: orderId });
    return response.data;
};

const GuestOrderTracking = () => {
    const [email, setEmail] = useState('');
    const [orderId, setOrderId] = useState('');
    const [orderDetails, setOrderDetails] = useState(null);

    const { mutate, status } = useMutation({
        mutationFn: fetchGuestOrder,
        onSuccess: (data) => setOrderDetails(data),
        onError: () => alert('Failed to fetch order details. Please try again.'),
    });

    const handleSubmit = () => {
        mutate({ email, orderId });
    };

    return (
        <Box p={5}>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>Guest Order Tracking</Text>
            <FormControl mb={4}>
                <FormLabel>Email</FormLabel>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl mb={4}>
                <FormLabel>Order ID</FormLabel>
                <Input value={orderId} onChange={(e) => setOrderId(e.target.value)} />
            </FormControl>
            <Button colorScheme="blue" onClick={handleSubmit} isLoading={status === 'loading'}>Track Order</Button>

            {status === 'error' && <Text color="red">Failed to retrieve order. Please try again.</Text>}

            {orderDetails && (
                <Box mt={5}>
                    <Text fontSize="lg" fontWeight="bold">Order #{orderDetails.id}</Text>
                    <Text>Status: {orderDetails.payment_status}</Text>
                    <Text>Total: Rs {orderDetails.total.toFixed(2)}</Text>
                    {/* Additional order details as needed */}
                </Box>
            )}
        </Box>
    );
};

export default GuestOrderTracking;
