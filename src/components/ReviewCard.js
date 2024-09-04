import React from 'react';
import { Box, Text, Flex, Avatar, Icon, HStack } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

const ReviewCard = () => {
    return (
        <Box p={4} borderWidth="1px" borderRadius="lg" mb={4}>
            <Flex alignItems="center" mb={4}>
                <Avatar size="md" name="John Doe" src="https://via.placeholder.com/50" mr={4} />
                <Box>
                    <Text fontWeight="bold">John Doe</Text>
                    <HStack>
                        {[...Array(5)].map((_, i) => (
                            <Icon key={i} as={FaStar} color={i < 4 ? "orange.400" : "gray.300"} />
                        ))}
                        <Text fontSize="sm" color="gray.500">(4.0)</Text>
                    </HStack>
                </Box>
            </Flex>
            <Text color="gray.700">Great shoes! Very comfortable and stylish. Would definitely recommend these to my friends and family.</Text>
        </Box>
    );
};

export default ReviewCard;
