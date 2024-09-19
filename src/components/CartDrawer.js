import React, {useState} from 'react';
import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button, Text, IconButton, Flex, Box, useDisclosure } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react';
import { useCart } from '../hooks/useCart';  // React Query custom hook for cart operations
import useCartStore from '../stores/cartStore';  // Zustand store for cart state
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import GuestInfoModal from './GuestInfoModal';
const CartDrawer = ({ isOpen, onClose, cartItems, loading }) => {
    const queryClient = useQueryClient(); // React Query client
    const cartId = localStorage.getItem('cartId'); // Get cartId from localStorage
    const accessToken = localStorage.getItem('accessToken'); // Get cartId from localStorage
    const { updateItemMutation, removeFromCartMutation, initiateCheckoutMutation } = useCart();  // React Query mutation
    const updateItemLocally = useCartStore((state) => state.updateItemLocally);  // Zustand action to update local state
    const { isOpen: isGuestModalOpen, onOpen: openGuestModal, onClose: closeGuestModal } = useDisclosure();  // For handling guest modal
    const navigate = useNavigate();
    const [guestInfo, setGuestInfo] = useState({  // Store guest info locally
        name: '',
        email: '',
        address: '',
        city: '',
        country: '',
        postal_code: ''
    });
    
    
    // Calculate total price, ensuring item.product and item.product.unit_price exist
    const overallTotalPrice = cartItems.reduce((total, item) => {
        const unitPrice = item.product?.unit_price || 0;  // Fallback to 0 if unit_price is undefined
        return total + unitPrice * item.quantity;
    }, 0).toFixed(2);

    // Handle quantity change
    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) return;  // Avoid negative or zero quantities

        console.log('Updating quantity:', newQuantity);  // Log to ensure correct value

        // Update the quantity locally first (optimistic update)
        updateItemLocally(itemId, newQuantity);

        // Call the mutation to update the quantity in the backend
        updateItemMutation.mutate({ itemId, quantity: newQuantity }, {
            onSuccess: (updatedItem) => {
                console.log('Quantity successfully updated:', updatedItem);
                // Optionally refetch the cart or update the local state
                queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
            },
            onError: (error) => {
                console.error('Error updating quantity:', error);
            }
        });
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

    // Handle checkout initiation
    const handleCheckout = () => {
        if (!accessToken) {
            //alert('Please login to checkout');
            openGuestModal();
        } else {
            const guestInfo = JSON.parse(localStorage.getItem('guestInfo')) || {};
            initiateCheckoutMutation.mutate(guestInfo);
        }
    };

    // Handle guest info submission
    const handleGuestSubmit = (guestInfo) => {
        // Store guest info in local storage to persist
        localStorage.setItem('guestInfo', JSON.stringify(guestInfo));
        // Proceed with checkout once guest info is collected
        initiateCheckoutMutation.mutate(guestInfo);
        closeGuestModal();  // Close the modal
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
                            onClick={handleCheckout}
                            isLoading={initiateCheckoutMutation.isLoading || loading}
                        >
                            Checkout
                        </Button>
                    </Flex>
                </DrawerFooter>
            </DrawerContent>
            {/* Guest checkout modal */}
            <GuestInfoModal
                isOpen={isGuestModalOpen}
                onClose={closeGuestModal}
                handleGuestSubmit={handleGuestSubmit}  // Pass handler for guest info submission
            />
        </Drawer>
    );
};

export default CartDrawer;
