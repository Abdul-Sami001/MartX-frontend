import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Text, VStack, Spinner, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import api from '../services/authInterceptor';  // Axios instance for authenticated requests

// Function to fetch orders
const fetchOrders = async () => {
    const response = await api.get('/store/orders/');
    return response.data;  // Make sure that `response.data` returns an array
};

const OrderHistory = () => {
    const navigate = useNavigate();

    const { data: orders, status } = useQuery({
        queryKey: ['orders'],
        queryFn: fetchOrders,
        // Fallback empty array while loading or if no orders are returned
        initialData: []
    });

    // Check if status is loading
    if (status === 'loading') {
        return <Spinner />;
    }

    // Check if there is an error
    if (status === 'error') {
        return <Text>Failed to load orders. Please try again.</Text>;
    }

    // Check if orders data exists and is an array
    if (!Array.isArray(orders) || orders.length === 0) {
        return <Text>No orders found.</Text>;
    }

    return (
        <Box p={5}>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>My Orders</Text>
            <VStack spacing={4} align="stretch">
                {orders.map((order) => (
                    <Box key={order.id} p={4} borderWidth="1px" borderRadius="lg">
                        <Text fontSize="lg" fontWeight="bold">Order #{order.id}</Text>
                        <Text>Status: {order.payment_status}</Text>
                        <Text>Total: Rs {order.total.toFixed(2)}</Text>
                        <Button
                            colorScheme="blue"
                            mt={2}
                            onClick={() => navigate(`/orders/${order.id}`)}
                        >
                            View Order
                        </Button>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

export default OrderHistory;
