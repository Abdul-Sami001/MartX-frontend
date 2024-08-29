import React, { useState } from 'react';
import { Box, Flex, Input, Button, IconButton, Image, InputGroup, InputRightElement, Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react';
import { SearchIcon, HamburgerIcon } from '@chakra-ui/icons';
import { FaShoppingCart } from 'react-icons/fa';

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(!isLoggedIn);
    };

    return (
        <Box as="nav" bg="#0A0E23" p={4} borderBottom="2px" borderColor="#F47D31" width="100%" position="fixed" top="0" zIndex="1000">
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
                    {isLoggedIn ? (
                        <Menu>
                            <MenuButton as={IconButton} icon={<Avatar size="sm" name="User Name" />} variant="ghost" color="white" mx={2} />
                            <MenuList>
                                <MenuItem>My Account</MenuItem>
                                <MenuItem>Logout</MenuItem>
                            </MenuList>
                        </Menu>
                    ) : (
                        <>
                            <Button
                                colorScheme="orange"
                                variant="outline"
                                borderColor="#F47D31"
                                color="white"
                                borderRadius="full"
                                mx={2}
                                onClick={handleLogin}
                            >
                                Login
                            </Button>
                            <Button
                                colorScheme="orange"
                                bg="#F47D31"
                                color="white"
                                borderRadius="full"
                                mx={2}
                            >
                                Become a Seller
                            </Button>
                        </>
                    )}
                    <IconButton
                        icon={<FaShoppingCart />}
                        aria-label="Shopping Cart"
                        variant="ghost"
                        size="lg"
                        mx={2}
                        _hover={{ bg: "#F47D31", color: "white" }}
                        color="white"
                    />
                </Flex>

                {/* Mobile Menu Icon */}
                <IconButton
                    icon={<HamburgerIcon />}
                    aria-label="Open Menu"
                    variant="ghost"
                    size="lg"
                    display={{ base: 'block', md: 'none' }}
                    color="white"
                    _hover={{ bg: "#F47D31", color: "white" }}
                />
            </Flex>
        </Box>
    );
}

export default Navbar;
