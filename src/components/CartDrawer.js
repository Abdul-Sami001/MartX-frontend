import React from 'react';
import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button, Text, IconButton, Flex, Box } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react';
import { useCart } from '../hooks/useCart';  // React Query custom hook for cart operations
import { updateItemQuantity } from '../services/cartService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useCartStore from '../stores/cartStore';
const CartDrawer = ({ isOpen, onClose, cartItems, initiateCheckout, loading }) => {
    const queryClient = useQueryClient(); // React Query client
    const cartId = localStorage.getItem('cartId'); // Get cartId from localStorage
    const updateItemLocally = useCartStore((state) => state.updateItemLocally); // Zustand action to update local state
    const { updateItemMutation, removeFromCartMutation  } = useCart();  // React Query mutation
    // Calculate total price, ensuring item.product and item.product.unit_price exist
    const overallTotalPrice = cartItems.reduce((total, item) => {
        const unitPrice = item.product?.unit_price || 0;  // Fallback to 0 if unit_price is undefined
        return total + unitPrice * item.quantity;
    }, 0).toFixed(2);

    // Handle quantity change
    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) return;  // Avoid 0 or negative quantities

        updateItemMutation.mutate(
            { itemId, quantity: newQuantity },
            {
                onMutate: async ({ itemId, quantity }) => {
                    // Optimistically update the cart in Zustand
                    updateItemLocally({ id: itemId, quantity });

                    // Optionally return a context with the previous state
                    return { previousItems: queryClient.getQueryData(['cart', cartId]) };
                },
                onError: (err, newItem, context) => {
                    // Rollback optimistic update if mutation fails
                    queryClient.setQueryData(['cart', cartId], context.previousItems);
                },
                onSettled: () => {
                    // Always refetch the cart after mutation
                    queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
                },
            }
        );
    };
    // Handle removing an item
    const handleRemoveItem = (itemId) => {
        if (!itemId) return;

        console.log("Removing item with ID:", itemId);
        removeFromCartMutation.mutate(itemId, {
            onSuccess: () => {
                console.log(`Item with ID ${itemId} removed successfully`);
            },
            onError: (error) => {
                console.error('Error removing item:', error);
            }
        });
    };

    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader>Your Cart</DrawerHeader>

                <DrawerBody>
                    {cartItems.length === 0 ? (
                        <Text>Your cart is empty.</Text>
                    ) : (
                        cartItems.map((item, index) => (
                            <Flex key={`${item.id}-${index}`} align="center" justify="space-between" mb={4}>
                                <Box boxSize="60px" bg="gray.100">
                                    {item.product?.image ? (
                                        <img src={item.product.image} alt={item.product.title} style={{ width: '100%', height: '100%' }} />
                                    ) : (
                                        <Text fontSize="xs">No image</Text>
                                    )}
                                </Box>
                                <Box flex="1" ml={3}>
                                    <Text fontWeight="bold">{item.product?.title || 'Unknown Product'}</Text>
                                    <Text>Unit Price: Rs {item.product?.unit_price ? item.product.unit_price.toFixed(2) : 'N/A'}</Text>
                                    <Text>Total: Rs {(item.product?.unit_price ? item.product.unit_price * item.quantity : 0).toFixed(2)}</Text>

                                    {/* Quantity Control */}
                                    <NumberInput
                                        size="sm"
                                        maxW={24}
                                        value={item.quantity}  // Set the current quantity
                                        min={1}
                                        onChange={(valueString) => handleQuantityChange(item.id, parseInt(valueString))}
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </Box>
                                <IconButton
                                    icon={<FaTrash />}
                                    aria-label="Remove Item"
                                    colorScheme="red"
                                    onClick={() => handleRemoveItem(item.id)}
                                />
                            </Flex>
                        ))
                    )}
                </DrawerBody>

                <DrawerFooter>
                    <Flex w="full" direction="column">
                        <Box mb={3}>
                            <Text fontWeight="bold">Total: Rs {overallTotalPrice}</Text>
                        </Box>
                        <Button
                            colorScheme="orange"
                            w="full"
                            onClick={initiateCheckout}
                            isLoading={loading}
                        >
                            Checkout
                        </Button>
                    </Flex>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default CartDrawer;
