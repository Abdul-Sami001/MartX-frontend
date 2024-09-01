import React, { useState, useEffect } from 'react';
import { fetchProducts, addToCart, fetchCart } from '../services/productService';
import { Box, Image, Text, Button, VStack, Grid } from '@chakra-ui/react';

const ProductList = ({ cartId, onUpdateCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async (url) => {
        setLoading(true);
        setError(null);
        try {
            const { products, nextPage, previousPage } = await fetchProducts(url);
            setProducts(products);
            setNextPage(nextPage);
            setPrevPage(previousPage);
        } catch (err) {
            setError('Failed to fetch products');
            console.error(err);
        }
        setLoading(false);
    };

    const handleAddToCart = async (productId) => {
        try {
            await addToCart(cartId, productId);
            alert('Item added to cart!');

            // Fetch the updated cart and pass it to the parent component
            const updatedCart = await fetchCart(cartId);
            onUpdateCart(updatedCart);
        } catch (err) {
            alert('Failed to add item to cart.');
            console.error(err);
        }
    };

    return (
        <Box padding="4" maxWidth="1200px" margin="auto">
            <Text fontSize="2xl" marginBottom="4">Products</Text>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <Grid
                    templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }}
                    gap={4}
                >
                    {products.map(product => (
                        <Box key={product.id} p="5" shadow="md" borderWidth="1px" borderRadius="md">
                            <Text fontWeight="bold" mb={2}>{product.title}</Text>
                            <Text mb={2} noOfLines={3}>{product.description}</Text>
                            <Text mb={2}>Price: ${product.price_with_tax.toFixed(2)}</Text>
                            {product.images.length > 0 && (
                                <Image
                                    src={product.images[0].image}
                                    alt={product.title}
                                    boxSize="150px"
                                    objectFit="cover"
                                    mb={2}
                                    borderRadius="md"
                                />
                            )}
                            <Button colorScheme="orange" onClick={() => handleAddToCart(product.id)}>
                                Add to Cart
                            </Button>
                        </Box>
                    ))}
                </Grid>
            )}
            {error && <Text color="red.500" mt={4}>Error: {error}</Text>}
            <Box display="flex" justifyContent="space-between" mt={4}>
                {prevPage && <Button onClick={() => loadProducts(prevPage)}>Previous</Button>}
                {nextPage && <Button onClick={() => loadProducts(nextPage)}>Next</Button>}
            </Box>
        </Box>
    );
};

export default ProductList;
