import React from 'react';
import { Box, Grid, Image, Text, Button, Flex, Icon } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import useCartStore from '../stores/cartStore';  // Import Zustand cart store
import useProductStore from '../stores/productStore';  // Import Zustand cart store

function ProductListing() {
    const products = useProductStore((state) => state.products);  // Fetch products from the product store
    const addToCart = useCartStore((state) => state.addToCart);  // Use the addToCart function from the cart store
    const initializeCart = useCartStore((state) => state.initializeCart);  // Use the initializeCart function

    const handleAddToCart = (product) => {
        addToCart(product);
        initializeCart();  // Re-fetch cart items to ensure the latest data is displayed
    };

    if (!products || products.length === 0) return <p>Loading...</p>;

    return (
        <Box p={4} mt={8}>
            <Text fontSize="2xl" mb={4} fontWeight="bold">Featured Products</Text>
            <Grid templateColumns="repeat(auto-fill, minmax(240px, 1fr))" gap={6}>
                {products.map((product) => (
                    <Box
                        key={product.id}
                        p={4}
                        border="1px solid #e2e8f0"
                        borderRadius="md"
                        _hover={{ boxShadow: "lg", transform: "translateY(-5px)" }}
                        transition="transform 0.3s ease"
                    >
                        <Box
                            height="200px"
                            width="100%"
                            overflow="hidden"
                            mb={4}
                            borderRadius="md"
                            bg="gray.100"
                        >
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    width="100%"
                                    height="100%"
                                    objectFit="cover"
                                    transition="transform 0.3s"
                                    _hover={{ transform: "scale(1.05)" }}
                                />
                            ) : (
                                <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                                    <Text>No Image Available</Text>
                                </Box>
                            )}
                        </Box>

                        <Text fontWeight="bold" mb={1} noOfLines={1} minHeight="24px">
                            {product.title}
                        </Text>

                        <Text fontSize="sm" color="gray.600" mb={2} noOfLines={3} minHeight="60px">
                            {product.description || ' '}
                        </Text>

                        <Flex mb={4} minHeight="24px">
                            {[...Array(5)].map((_, i) => (
                                <Icon
                                    key={i}
                                    as={FaStar}
                                    color={i < product.rating ? "orange.400" : "gray.300"}
                                    boxSize={4}
                                />
                            ))}
                        </Flex>

                        <Text fontWeight="bold" fontSize="lg" mb={4} minHeight="24px">
                            {product.unit_price ? `Rs ${product.unit_price.toFixed(2)}` : 'N/A'}
                        </Text>

                        <Button
                            bgGradient="linear(to-b,  #132063, #0A0E23)"
                            color="white"
                            _hover={{ bgGradient: "linear(to-b,  orange.200, orange.600)", boxShadow: "md" }}
                            size="sm"
                            width="full"
                            onClick={() => handleAddToCart(product)}  // Handle add to cart and re-fetch the cart
                        >
                            Add to Cart
                        </Button>
                    </Box>
                ))}
            </Grid>
        </Box>
    );
}

export default ProductListing;
