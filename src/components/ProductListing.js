import React from 'react';
import { Box, Grid, Image, Text, Button, Flex, Icon } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

function ProductListing() {
    const products = [
        { name: "Product 1", price: "$50", image: "/category-imgs/category1.jpeg", description: "This is a great product", rating: 4 },
        { name: "Product 2", price: "$75", image: "/category-imgs/category2.jpeg", description: "This is another great product", rating: 5 },
        // Add more product objects here...
    ];

    return (
        <Box p={4} mt={8}>
            <Text fontSize="2xl" mb={4} fontWeight="bold">Featured Products</Text>
            <Grid templateColumns="repeat(auto-fill, minmax(240px, 1fr))" gap={6}>
                {products.map((product, index) => (
                    <Box
                        key={index}
                        p={4}
                        border="1px solid #e2e8f0"
                        borderRadius="md"
                        _hover={{ boxShadow: "lg", transform: "translateY(-5px)" }}
                        transition="transform 0.3s ease"
                    >
                        {/* Product Image */}
                        <Box
                            height="200px"
                            width="100%"
                            overflow="hidden"
                            mb={4}
                            borderRadius="md"
                        >
                            <Image
                                src={product.image}
                                alt={product.name}
                                width="100%"
                                height="100%"
                                objectFit="cover"
                                transition="transform 0.3s"
                                _hover={{ transform: "scale(1.05)" }}
                            />
                        </Box>

                        {/* Product Name */}
                        <Text fontWeight="bold" mb={1}>{product.name}</Text>

                        {/* Product Description */}
                        <Text fontSize="sm" color="gray.600" mb={2}>
                            {product.description}
                        </Text>

                        {/* Product Rating */}
                        <Flex mb={4}>
                            {[...Array(5)].map((_, i) => (
                                <Icon
                                    key={i}
                                    as={FaStar}
                                    color={i < product.rating ? "orange.400" : "gray.300"}
                                    boxSize={4}
                                />
                            ))}
                        </Flex>

                        {/* Product Price */}
                        <Text fontWeight="bold" fontSize="lg" mb={4}>{product.price}</Text>

                        {/* Add to Cart Button */}
                        <Button
                            bgGradient="linear(to-b,  #132063, #0A0E23)"
                            color="white"
                            _hover={{ bgGradient: "linear(to-b,  orange.200, orange.600)", boxShadow: "md" }}
                            size="sm"
                            width="full"
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
