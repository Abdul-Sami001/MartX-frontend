import React from 'react';
import { Box, Flex, Heading, Text, Input, Button } from '@chakra-ui/react';

function NewsletterSignup() {
    return (
        <Box
            bg="#0A0E23"
            color="white"
            py={8}
            px={4}
            mt={12}
            borderRadius="md"
            textAlign="center"
        >
            <Heading as="h3" size="lg" mb={4}>
                Join Our Newsletter
            </Heading>
            <Text fontSize="md" mb={6}>
                Subscribe to our newsletter and get updates on new arrivals, special offers, and more.
            </Text>
            <Flex
                as="form"
                direction={{ base: 'column', md: 'row' }}
                alignItems="center"
                justifyContent="center"
            >
                <Input
                    placeholder="Enter your email address"
                    type="email"
                    size="lg"
                    mb={{ base: 4, md: 0 }}
                    mr={{ md: 4 }}
                    borderRadius="full"
                    border="none"
                    focusBorderColor="none"
                    _placeholder={{ color: "gray.400" }}
                />
                <Button
                    size="lg"
                    bgGradient="linear(to-r, #F47D31, #e36625)"
                    color="white"
                    borderRadius="full"
                    _hover={{ bgGradient: "linear(to-r, #e36625, #e2451a)", boxShadow: "md" }}
                >
                    Subscribe
                </Button>
            </Flex>
        </Box>
    );
}

export default NewsletterSignup;
