import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderConfirmation = () => {
    const [orderDetails, setOrderDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve order details from localStorage
        const storedOrderDetails = JSON.parse(localStorage.getItem('orderDetails'));
        if (storedOrderDetails) {
            setOrderDetails(storedOrderDetails);
        } else {
            // If no order details are found, redirect back to store or homepage
            navigate('/dashboard');
        }
    }, [navigate]);

    if (!orderDetails) {
        return <Text>Loading...</Text>;  // Show loading state until order details are retrieved
    }
    return (
        <Box>
            <Heading>Order Confirmation</Heading>
            <Text>Order ID: {orderDetails.id}</Text>
            <Text>Payment Status: {orderDetails.payment_status}</Text>
            <Text>Total Amount: {orderDetails.total}</Text>

            {/* List items in the order */}
            <Box mt={4}>
                {orderDetails.items.map((item, index) => (
                    <Text key={index}>{item.product.title} - {item.quantity} x {item.unit_price}</Text>
                ))}
            </Box>

            <Button mt={6} colorScheme="blue" onClick={() => navigate('/store')}>
                Back to Store
            </Button>
        </Box>
    );
};

export default OrderConfirmation;
