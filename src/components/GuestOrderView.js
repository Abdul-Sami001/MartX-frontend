import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Text, Heading, VStack } from '@chakra-ui/react';
import axios from 'axios';

const GuestOrderView = () => {
    const { orderId } = useParams();  // Get the order ID from the URL
    const [orderDetails, setOrderDetails] = useState(null);
    const guestEmail = localStorage.getItem('guestEmail');  // Get the guest email from localStorage

    useEffect(() => {
        // Fetch the guest order details from the backend
        const fetchGuestOrder = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/store/guest-orders/', {
                    order_id: orderId,
                    email: guestEmail,  // Send the guest email along with the order ID
                });
                setOrderDetails(response.data);
            } catch (error) {
                console.error('Error fetching guest order details:', error);
            }
        };

        fetchGuestOrder();
    }, [orderId, guestEmail]);

    return (
        <Box maxWidth="500px" margin="auto" padding={8}>
            {orderDetails ? (
                <>
                    <Heading as="h1" size="xl">Order Confirmation</Heading>
                    <Text fontSize="lg">Order ID: {orderDetails.id}</Text>
                    <Text fontSize="lg">Total: ${orderDetails.total}</Text>
                    <Text fontSize="lg">Payment Status: {orderDetails.payment_status}</Text>

                    <VStack spacing={4} mt={6}>
                        {orderDetails.items.map((item, index) => (
                            <Box key={index} borderWidth="1px" borderRadius="lg" p={4} width="100%">
                                <Text fontWeight="bold">{item.product.title}</Text>
                                <Text>Quantity: {item.quantity}</Text>
                                <Text>Price: ${item.unit_price.toFixed(2)}</Text>
                            </Box>
                        ))}
                    </VStack>
                </>
            ) : (
                <Text>Loading order details...</Text>
            )}
        </Box>
    );
};

export default GuestOrderView;
