import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Text, VStack, Spinner, HStack } from '@chakra-ui/react';
import api from '../services/authInterceptor';  // Axios instance for authenticated requests

// Function to fetch order details
const fetchOrderDetails = async (orderId) => {
    const response = await api.get(`/store/orders/${orderId}/`);
    return response.data;
};

const OrderDetail = () => {
    const { orderId } = useParams();  // Get orderId from the URL params

    const { data: order, status } = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => fetchOrderDetails(orderId),
    });

    // Loading state
    if (status === 'loading') {
        return <Spinner />;
    }

    // Error state
    if (status === 'error') {
        return <Text>Failed to load order details. Please try again.</Text>;
    }

    // Check if the order is defined and has necessary properties
    if (!order || !order.items || order.items.length === 0) {
        return <Text>No order details available.</Text>;
    }

    return (
        <Box p={5}>
            {/* Safeguard to check if 'order' and 'id' exist */}
            <Text fontSize="2xl" fontWeight="bold" mb={4}>Order #{order?.id}</Text>
            <Text>Status: {order?.payment_status}</Text>
            <Text>Total: Rs {order?.total?.toFixed(2)}</Text>

            <Text fontSize="lg" fontWeight="bold" mt={5} mb={2}>Items:</Text>
            <VStack spacing={4} align="stretch">
                {/* Safeguard around 'items' array */}
                {order.items.map((item) => (
                    <Box key={item.id} p={4} borderWidth="1px" borderRadius="lg">
                        <HStack justifyContent="space-between">
                            <Text fontWeight="bold">{item?.product?.title}</Text>
                            <Text>Quantity: {item?.quantity}</Text>
                        </HStack>
                        <Text>Unit Price: Rs {item?.unit_price?.toFixed(2)}</Text>
                        <Text>Total: Rs {(item?.unit_price * item?.quantity).toFixed(2)}</Text>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

export default OrderDetail;
