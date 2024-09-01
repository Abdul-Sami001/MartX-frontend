import React, { useEffect } from 'react';
import {
    Box,
    Text,
    Flex,
    Button,
    Avatar,
    CircularProgress,
    CircularProgressLabel,
    VStack,
    HStack,
    Icon,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import useVendorStore from '../stores/vendorStore';

const VendorCard = ({
    avatarUrl = 'https://via.placeholder.com/150',
    companyName = 'Company Name',
    rating = 4.5,
    visitHandler,
}) => {
    const fetchVendors = useVendorStore((state) => state.fetchVendors); // Fetching vendors from Zustand store
    const vendors = useVendorStore((state) => state.vendors);
    const loading = useVendorStore((state) => state.loading);
    const error = useVendorStore((state) => state.error);

    useEffect(() => {
        fetchVendors(); // Fetch vendors when the component mounts
    }, [fetchVendors]);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error}</Text>;

    return (
        <>
            <p className="chakra-text css-e18170">Top Rated Seller's</p>
            <Box
                width="280px" // Decreased width to make it more compact
                p={4}
                borderWidth="1px"
                borderRadius="xl"
                overflow="hidden"
                boxShadow="lg"
                bgGradient="linear(to-r, #132063, #0A0E23)"
                color="white"
                position="relative"
                _hover={{ boxShadow: "2xl", transform: "translateY(-5px)" }}
                transition="transform 0.3s ease"
            >
                {vendors.map((vendor) => (
                    <React.Fragment key={vendor.id}>
                        <Flex justifyContent="flex-end">
                            <CircularProgress value={rating * 20} color="orange.400" size="45px" thickness="6px">
                                <CircularProgressLabel fontSize="lg" color="orange.400">{vendor.average_rating}</CircularProgressLabel>
                            </CircularProgress>
                        </Flex>

                        {/* Avatar and Company Name */}
                        <VStack spacing={4} align="center" mt={-8}>
                            <Avatar size="xxl" name={vendor.name || companyName} src={avatarUrl} borderColor="orange.400" borderWidth={2} />
                            <Text fontSize="xl" fontWeight="bold" color="orange.200">
                                {vendor.name || companyName}
                            </Text>
                        </VStack>

                        {/* Top-Rated Label and Stars */}
                        <Box mt={4} textAlign="center">
                            <Text fontSize="md" fontWeight="bold" color="orange.300">
                                TOP-RATED
                            </Text>
                            <HStack justify="center" mt={2}>
                                {[...Array(5)].map((_, i) => (
                                    <Icon
                                        key={i}
                                        as={FaStar}
                                        color={i < rating ? "orange.400" : "gray.500"}
                                        boxSize={4}
                                    />
                                ))}
                            </HStack>
                        </Box>

                        {/* Other Details */}
                        <Box mt={4} textAlign="center">
                            <Text fontSize="sm" color="gray.300">
                                {vendor.shop_description}
                            </Text>
                            <HStack justify="center" mt={2}>
                                <HStack>
                                    <Text fontSize="xs" color="gray.400">Delivery:</Text>
                                    <Text fontSize="xs">On Time</Text>
                                </HStack>
                                <HStack>
                                    <Text fontSize="xs" color="gray.400">Response:</Text>
                                    <Text fontSize="xs">Quick</Text>
                                </HStack>
                            </HStack>
                        </Box>

                        {/* Visit Button */}
                        <Flex justify="center" mt={6}>
                            <Button
                                colorScheme="orange"
                                bg="orange.400"
                                color="white"
                                borderRadius="full"
                                onClick={visitHandler}
                                _hover={{ bg: "orange.500" }}
                            >
                                Visit Vendor
                            </Button>
                        </Flex>

                        {/* Bottom Right Design Element */}
                        <Box position="absolute" bottom={2} right={2}>
                            <Box
                                width="40px"
                                height="2px"
                                bg="orange.400"
                                mb="2px"
                            />
                            <Box
                                width="30px"
                                height="2px"
                                bg="orange.200"
                            />
                        </Box>
                    </React.Fragment>
                ))}
            </Box>
        </>
    );
};

export default VendorCard;
