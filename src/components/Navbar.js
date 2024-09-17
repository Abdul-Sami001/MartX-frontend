import React, { useState } from 'react';
import { Box, Flex, Button, Image, Stack, useDisclosure, IconButton, Text } from '@chakra-ui/react';
import { FaShoppingCart } from 'react-icons/fa';  // Import cart icon
import { useCheckout } from '../hooks/useCheckout';
import CartDrawer from './CartDrawer';
import GuestCheckoutModal from './GuestCheckoutModal';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';  // Zustand store for cart state

function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure(); // For Cart Drawer
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure(); // For Guest Checkout Modal

    const cartItems = useCartStore((state) => state.cartItems);  // Zustand to get cart items
    const [guestInfo, setGuestInfo] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        country: '',
        postal_code: '',
    });

    const toast = useToast();
    const navigate = useNavigate();

    const { mutate: initiateCheckoutMutation, isLoading: checkoutLoading } = useCheckout();

    const handleGuestCheckout = () => {
        if (!guestInfo.name || !guestInfo.email || !guestInfo.address || !guestInfo.city || !guestInfo.postal_code) {
            toast({
                title: 'Missing Information',
                description: 'Please fill in all the required fields.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        initiateCheckoutMutation({ cartId: localStorage.getItem('cartId'), guestInfo });
        onModalClose();
    };

    const initiateCheckout = () => {
        const cartId = localStorage.getItem('cartId');
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            initiateCheckoutMutation({ cartId, guestInfo: {} });
        } else {
            onModalOpen();
        }
    };

    return (
        <Box as="nav" bg="#0A0E23" p={4} borderBottom="2px" borderColor="#F47D31" mb={0}>
            <Flex align="center" justify="space-between" maxW="1200px" mx="auto" flexWrap="wrap">
                {/* Logo */}
                <Box mb={{ base: 2, md: 0 }}>
                    <Image src="/logo.jpeg" alt="Logo" height="40px" />
                </Box>

                {/* Add Cart Icon */}
                <Flex align="center">
                    <IconButton
                        icon={<FaShoppingCart />}
                        aria-label="Shopping Cart"
                        variant="ghost"
                        size="lg"
                        _hover={{ bg: '#F47D31', color: 'white' }}
                        color="white"
                        onClick={onOpen}  // Opens the cart drawer
                    />
                    <Text color="white" ml={1}>{cartItems.length}</Text> {/* Show number of items in cart */}
                </Flex>

                {/* Cart Drawer */}
                <CartDrawer
                    isOpen={isOpen}
                    onClose={onClose}
                    cartItems={cartItems}
                    initiateCheckout={initiateCheckout}
                    loading={checkoutLoading}
                />

                {/* Guest Checkout Modal */}
                <GuestCheckoutModal
                    isModalOpen={isModalOpen}
                    onModalClose={onModalClose}
                    guestInfo={guestInfo}
                    setGuestInfo={setGuestInfo}
                    handleGuestCheckout={handleGuestCheckout}
                />
            </Flex>
        </Box>
    );
}

export default Navbar;
