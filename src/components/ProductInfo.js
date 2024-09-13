import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Text, Select, Button, Flex, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react';
import { handleBuyNow } from '../services/buyNowService';  // Import the BuyNow service

const ProductInfo = ({ product }) => {
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();  // For redirecting after order creation

    const handleBuyNowClick = () => {
        const userInfo = {};  // Populate with guest user info if applicable
        handleBuyNow(product.id, quantity, userInfo, setLoading, navigate);
    };

    return (
        <Box p={4}>
            <Text fontSize="2xl" fontWeight="bold" mb={2}>{product.title}</Text>
            <Text fontSize="lg" color="gray.600" mb={4}>Price: Rs {product.price_with_tax.toFixed(2)}</Text>
            <Text fontSize="md" color="gray.600" mb={4}>{product.description}</Text>

            {/* Additional product fields like size, color */}
            <Select placeholder="Select Size" mb={3} onChange={(e) => setSize(e.target.value)}>
                <option value="size8">Size 8</option>
                <option value="size9">Size 9</option>
                <option value="size10">Size 10</option>
            </Select>

            <Select placeholder="Select Color" mb={3} onChange={(e) => setColor(e.target.value)}>
                <option value="white">White</option>
                <option value="black">Black</option>
            </Select>

            <Flex gap={4} alignItems="center" mb={4}>
                <Text fontWeight="bold">Quantity:</Text>
                <NumberInput min={1} defaultValue={1} value={quantity} onChange={(value) => setQuantity(parseInt(value))}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </Flex>

            <Flex gap={4}>
                <Button colorScheme="orange" size="lg">Add to Cart</Button>
                <Button colorScheme="gray" size="lg" isLoading={loading} onClick={handleBuyNowClick}>Buy Now</Button>
            </Flex>
        </Box>
    );
};

export default ProductInfo;
