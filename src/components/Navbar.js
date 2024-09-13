import React, { useState, useEffect } from 'react';
import {
    Box, Text, Flex, Button, Image,
    Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
    useDisclosure, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
    InputGroup, InputRightElement, Input, IconButton, Stack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, FormControl, FormLabel
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import useCartStore from '../stores/cartStore';
import { handleCheckout } from '../services/checkoutService';  // Import the centralized checkout function
import { useToast } from '@chakra-ui/react';  // For notifications (toast)
import { useNavigate } from 'react-router-dom';  // For page navigation

function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure(); // Drawer control
    const cartItems = useCartStore((state) => state.cartItems);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const [localQuantities, setLocalQuantities] = useState([]);
    const [localTotalPrices, setLocalTotalPrices] = useState([]);
    const [loading, setLoading] = useState(false);  // Add loading state
    const toast = useToast();  // For notifications
    const navigate = useNavigate();  // For navigation

    const [guestInfo, setGuestInfo] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        country: '',
        postal_code: '',
    });

    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();  // Modal for guest info

    // Initialize local state based on cart items, but only once
    useEffect(() => {
        if (localQuantities.length === 0 && localTotalPrices.length === 0) {
            const quantities = cartItems.map(item => item.quantity);
            const totalPrices = cartItems.map(item => item.total_price);
            setLocalQuantities(quantities);
            setLocalTotalPrices(totalPrices);
        }
    }, [cartItems, localQuantities.length, localTotalPrices.length]);

    // Calculate the total price of the cart
    const overallTotalPrice = localTotalPrices.reduce((total, price) => total + (price || 0), 0).toFixed(2);

    const handleQuantityChange = (itemId, newQuantity, index) => {
        if (isNaN(newQuantity) || newQuantity < 1) return;

        const updatedQuantities = [...localQuantities];
        updatedQuantities[index] = newQuantity;
        setLocalQuantities(updatedQuantities);

        const updatedTotalPrices = [...localTotalPrices];
        updatedTotalPrices[index] = newQuantity * (cartItems[index]?.product?.unit_price || 0);
        setLocalTotalPrices(updatedTotalPrices);

        updateQuantity(itemId, newQuantity);
    };

    // Cart ID from localStorage
    const cartId = localStorage.getItem('cartId');
    const accessToken = localStorage.getItem('accessToken');  // Check if the user is authenticated

    // Handle checkout
    const initiateCheckout = () => {
        if (accessToken) {
            // If authenticated, proceed with checkout
            handleCheckout(cartId, {}, setLoading, toast, navigate);
        } else {
            // If unauthenticated, open guest info modal
            onModalOpen();
        }
    };

    // Handle Guest Info Submission for Checkout
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
        // Save guest info in localStorage so it's used in the checkout form
        localStorage.setItem('guestInfo', JSON.stringify(guestInfo));

        onModalClose();  // Close the modal once info is collected
        handleCheckout(cartId, guestInfo, setLoading, toast, navigate);  // Pass guest info to handleCheckout
    };

    return (
        <Box as="nav" bg="#0A0E23" p={4} borderBottom="2px" borderColor="#F47D31" marginBottom="0">
            <Flex align="center" justify="space-between" maxW="1200px" mx="auto" flexWrap="wrap">
                {/* Logo */}
                <Box mb={{ base: 2, md: 0 }}>
                    <Image src="/logo.jpeg" alt="MartX Logo" height="40px" />
                </Box>

                {/* Search Bar */}
                <Box flex="1" mb={{ base: 2, md: 0 }} w={{ base: "100%", md: "auto" }}>
                    <InputGroup>
                        <Input
                            placeholder="Search for products"
                            bg="white"
                            borderRadius="full"
                            _focus={{ borderColor: "#F47D31" }}
                            _placeholder={{ color: "#0A0E23" }}
                        />
                        <InputRightElement>
                            <Button colorScheme="orange" borderRadius="full">
                                <SearchIcon />
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </Box>

                {/* Buttons & Icons */}
                <Stack direction="row" spacing={2} align="center">
                    <Button colorScheme="orange" variant="outline" borderColor="#F47D31" color="white" borderRadius="full">
                        Login
                    </Button>
                    <Button colorScheme="orange" bg="#F47D31" color="white" borderRadius="full">
                        Become a Seller
                    </Button>
                    <Flex align="center">
                        <IconButton
                            icon={<FaShoppingCart />}
                            aria-label="Shopping Cart"
                            variant="ghost"
                            size="lg"
                            _hover={{ bg: "#F47D31", color: "white" }}
                            color="white"
                            onClick={onOpen} // Open the drawer on click
                        />
                        <Text color="white" ml={1}>{cartItems.length}</Text>
                    </Flex>
                </Stack>

                {/* Slide-in Cart Drawer */}
                <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Your Cart</DrawerHeader>

                        <DrawerBody>
                            {cartItems.length === 0 ? (
                                <Text>Your cart is empty.</Text>
                            ) : (
                                cartItems.map((item, index) => (
                                    <Flex key={item.id} align="center" justify="space-between" mb={4}>
                                        {/* Image Container */}
                                        <Box boxSize="60px" bg="gray.100" display="flex" alignItems="center" justifyContent="center">
                                            {item.product?.image ? (
                                                <Image src={item.product.image} alt={item.product.title} boxSize="60px" objectFit="cover" />
                                            ) : (
                                                <Text fontSize="xs" color="gray.500">No image available</Text>
                                            )}
                                        </Box>

                                        <Box flex="1" ml={3}>
                                            <Text fontWeight="bold" mb={2}>{item.product?.title || 'No title available'}</Text>
                                            <Text color="gray.500">Unit Price: Rs {item.product?.unit_price?.toFixed(2) || 'N/A'}</Text>
                                            <Text color="gray.500">Total: Rs {item.total_price?.toFixed(2) || 'N/A'}</Text>

                                            {/* Quantity Control */}
                                            <NumberInput
                                                size="sm"
                                                maxW={24}
                                                value={localQuantities[index]}
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
                                        <IconButton
                                            icon={<FaTrash />}
                                            aria-label="Remove Item"
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() => removeFromCart(item.id)}
                                        />
                                    </Flex>
                                ))
                            )}
                        </DrawerBody>

                        <DrawerFooter>
                            <Flex w="full" direction="column">
                                <Box mb={3}>
                                    <Text fontWeight="bold">Estimated Total</Text>
                                    <Text fontSize="lg">Rs {overallTotalPrice}</Text>
                                    <Text fontSize="sm" color="gray.500">Taxes included. Discounts and shipping calculated at checkout.</Text>
                                </Box>
                                <Button
                                    colorScheme="orange"
                                    w="full"
                                    onClick={initiateCheckout}  // Trigger checkout based on user type
                                    isLoading={loading}
                                >
                                    Checkout
                                </Button>
                            </Flex>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Flex>

            {/* Modal for guest user information */}
            <Modal isOpen={isModalOpen} onClose={onModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Guest Checkout Information</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired>
                            <FormLabel>Full Name</FormLabel>
                            <Input value={guestInfo.name} onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })} />
                        </FormControl>
                        <FormControl isRequired mt={4}>
                            <FormLabel>Email</FormLabel>
                            <Input type="email" value={guestInfo.email} onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })} />
                        </FormControl>
                        <FormControl isRequired mt={4}>
                            <FormLabel>Address</FormLabel>
                            <Input value={guestInfo.address} onChange={(e) => setGuestInfo({ ...guestInfo, address: e.target.value })} />
                        </FormControl>
                        <FormControl isRequired mt={4}>
                            <FormLabel>City</FormLabel>
                            <Input value={guestInfo.city} onChange={(e) => setGuestInfo({ ...guestInfo, city: e.target.value })} />
                        </FormControl>
                        <FormControl isRequired mt={4}>
                            <FormLabel>Country</FormLabel>
                            <Input value={guestInfo.country} onChange={(e) => setGuestInfo({ ...guestInfo, country: e.target.value })} />
                        </FormControl>
                        <FormControl isRequired mt={4}>
                            <FormLabel>Postal Code</FormLabel>
                            <Input value={guestInfo.postal_code} onChange={(e) => setGuestInfo({ ...guestInfo, postal_code: e.target.value })} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleGuestCheckout}>
                            Proceed to Checkout
                        </Button>
                        <Button variant="ghost" onClick={onModalClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default Navbar;
