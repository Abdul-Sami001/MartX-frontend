import React, { useEffect } from 'react';
import {
    Box, Text, Flex, Button, Image, IconButton,
    NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import useCartStore from '../stores/cartStore';  // Import the Zustand cart store

function Cart() {
    const cartItems = useCartStore((state) => state.cartItems);  // Get cart items from the store
    const removeFromCart = useCartStore((state) => state.removeFromCart);  // Get removeFromCart action
    const updateQuantity = useCartStore((state) => state.updateQuantity);  // Get updateQuantity action

    // Log cart items to inspect their structure
    useEffect(() => {
        console.log('Cart items:', cartItems);
    }, [cartItems]);

    const handleQuantityChange = (itemId, value) => {
        const newQuantity = parseInt(value, 10);
        if (isNaN(newQuantity) || newQuantity < 1) return;
        updateQuantity(itemId, newQuantity);  // Update quantity in the store
    };

    if (!cartItems || cartItems.length === 0) {
        return <Text>Your cart is empty.</Text>;  // Show empty cart message if no items
    }
    //const total_price = cartItems.items.total_price;
    return (
        <Box p={6} maxW="800px" mx="auto">
            <Text fontSize="2xl" fontWeight="bold" mb={4}>Your Cart</Text>
            {cartItems.map((item, index) => {
                // Safely access product data
                
                const product = item?.product || {};
                const imageUrl = product.image || '';  // Handle missing image
                const title = product.title || 'No title available';  // Handle missing title
                const unitPrice = product.unit_price ? product.unit_price.toFixed(2) : 'N/A';  // Handle missing unit price
                const totalPrice = product.unit_price ? (product.unit_price * item.quantity).toFixed(2) : 'N/A';  // Calculate total price

                return (
                    <Flex key={item.id} p={4} alignItems="center" justifyContent="space-between" borderBottom="1px solid #e2e8f0">
                        <Flex align="center" flex="1">
                            {/* Product Image */}
                            {imageUrl ? (
                                <Image src={imageUrl} alt={title} boxSize="60px" objectFit="cover" borderRadius="md" />
                            ) : (
                                <Box boxSize="60px" bg="gray.200" display="flex" alignItems="center" justifyContent="center" borderRadius="md">
                                    <Text fontSize="xs" color="gray.500">No image available</Text>
                                </Box>
                            )}
                            <Box ml={4}>
                                {/* Product Title and Price */}
                                <Text fontWeight="bold" mb={1}>{title}</Text>
                                <Text color="gray.500">Unit Price: Rs {unitPrice}</Text>
                                <Text color="gray.500">Total: Rs {totalPrice}</Text>

                                {/* Quantity Control */}
                                <NumberInput
                                    size="sm"
                                    maxW={24}
                                    //value={localQuantities[index]}
                                    min={1}
                                    onChange={(value) => handleQuantityChange(item.id, parseInt(value), index)}
                                    mt={2}
                                >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </Box>
                        </Flex>
                        {/* Remove Item Button */}
                        <IconButton
                            icon={<FaTrash />}
                            aria-label="Remove Item"
                            colorScheme="red"
                            variant="outline"
                            onClick={() => removeFromCart(item.id)}
                            size="sm"
                        />
                    </Flex>
                );
            })}
            {/* Display Estimated Total and Checkout Button */}
            <Flex justifyContent="space-between" alignItems="center" mt={6}>
                <Text fontSize="lg" fontWeight="bold">
                    Estimated Total: Rs {cartItems.reduce((total, item) => total + (item.product?.unit_price * item.quantity || 0), 0).toFixed(2)}
                </Text>
                <Button colorScheme="orange" size="lg">
                    Checkout
                </Button>
            </Flex>
        </Box> 
    );
}

export default Cart;
