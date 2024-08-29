import React, { useState, useEffect } from 'react';
import { fetchCart, updateCartItem, removeCartItem } from '../services/productService';
import { Box, Text, Button, Input, HStack, VStack } from '@chakra-ui/react';

const Cart = ({ cartId }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCart = async () => {
            try {
                const data = await fetchCart(cartId);
                setCart(data);
            } catch (err) {
                setError('Failed to load cart');
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, [cartId]);

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            alert('Quantity must be at least 1');
            return;
        }

        try {
            const updatedItem = await updateCartItem(cartId, itemId, newQuantity);
            setCart((prevCart) => {
                const updatedItems = prevCart.items.map(item =>
                    item.id === updatedItem.id ? updatedItem : item
                );
                const updatedTotalPrice = updatedItems.reduce(
                    (sum, item) => sum + item.total_price,
                    0
                );
                return {
                    ...prevCart,
                    items: updatedItems,
                    total_price: updatedTotalPrice,
                };
            });
        } catch (err) {
            console.error('Failed to update item quantity:', err);
            alert('Failed to update item quantity.');
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await removeCartItem(cartId, itemId);
            setCart((prevCart) => {
                const updatedItems = prevCart.items.filter(item => item.id !== itemId);
                const updatedTotalPrice = updatedItems.reduce(
                    (sum, item) => sum + item.total_price,
                    0
                );
                return {
                    ...prevCart,
                    items: updatedItems,
                    total_price: updatedTotalPrice,
                };
            });
        } catch (err) {
            console.error('Failed to remove item from cart:', err);
            alert('Failed to remove item from cart.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Box>
            <Text fontSize="2xl" mb={4}>Your Cart</Text>
            <VStack spacing={4}>
                {cart.items.map(item => (
                    <Box key={item.id} p={4} border="1px solid #ccc" w="100%">
                        <Text fontWeight="bold">{item.product.title}</Text>
                        <Text>Price: ${item.product.unit_price.toFixed(2)}</Text>
                        <HStack mt={2} align="center">
                            <Button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</Button>
                            <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                                width="60px"
                                textAlign="center"
                            />
                            <Button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</Button>
                        </HStack>
                        <Text mt={2}>Total: ${item.total_price.toFixed(2)}</Text>
                        <Button mt={2} colorScheme="red" onClick={() => handleRemoveItem(item.id)}>Remove</Button>
                    </Box>
                ))}
            </VStack>
            <Text mt={4} fontWeight="bold">Total Price: ${cart.total_price.toFixed(2)}</Text>
        </Box>
    );
};

export default Cart;
