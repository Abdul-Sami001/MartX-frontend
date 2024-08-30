import React, { useState, useEffect } from 'react';
import {
    Box, Text, Flex, Button, Image,
    Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
    useDisclosure, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputGroup, InputRightElement, Input, IconButton
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import useCartStore from '../stores/cartStore';

function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure(); // Drawer control
    const cartItems = useCartStore((state) => state.cartItems);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const [localQuantities, setLocalQuantities] = useState([]);
    const [localTotalPrices, setLocalTotalPrices] = useState([]);

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

    return (
        <Box as="nav" bg="#0A0E23" p={4} borderBottom="2px" borderColor="#F47D31" marginBottom="0">
            <Flex align="center" justify="space-between" maxW="1200px" mx="auto">
                {/* Logo */}
                <Box>
                    <Image src="/logo.jpeg" alt="MartX Logo" height="40px" />
                </Box>

                {/* Search Bar */}
                <InputGroup w="40%">
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

                {/* Buttons & Icons */}
                <Flex align="center">
                    <Button colorScheme="orange" variant="outline" borderColor="#F47D31" color="white" borderRadius="full" mx={2}>
                        Login
                    </Button>
                    <Button colorScheme="orange" bg="#F47D31" color="white" borderRadius="full" mx={2}>
                        Become a Seller
                    </Button>
                    <IconButton
                        icon={<FaShoppingCart />}
                        aria-label="Shopping Cart"
                        variant="ghost"
                        size="lg"
                        mx={2}
                        _hover={{ bg: "#F47D31", color: "white" }}
                        color="white"
                        onClick={onOpen} // Open the drawer on click
                    />
                    <Text color="white" ml={1}>{cartItems.length}</Text>
                </Flex>

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
                                <Button colorScheme="orange" w="full" onClick={onClose}>
                                    Checkout
                                </Button>
                            </Flex>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Flex>
        </Box>
    );
}

export default Navbar;