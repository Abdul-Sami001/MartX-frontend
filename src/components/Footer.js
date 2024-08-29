import React from 'react';
import { Box, Text, Flex, Link } from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

function Footer() {
    return (
        <Box bg="#0A0E23" color="white" p={8} mt={8}>
            <Flex justify="space-between" wrap="wrap">
                <Box>
                    <Text fontSize="xl" mb={4} fontWeight="bold">Quick Links</Text>
                    <Link href="/contact" display="block" mb={2}>Contact Us</Link>
                    <Link href="/faq" display="block" mb={2}>FAQ</Link>
                    <Link href="/returns" display="block">Return Policy</Link>
                </Box>
                <Box>
                    <Text fontSize="xl" mb={4} fontWeight="bold">Connect with Us</Text>
                    <Flex>
                        <Link href="https://facebook.com" isExternal mr={4}><FaFacebook size="24px" /></Link>
                        <Link href="https://twitter.com" isExternal mr={4}><FaTwitter size="24px" /></Link>
                        <Link href="https://instagram.com" isExternal><FaInstagram size="24px" /></Link>
                    </Flex>
                </Box>
                <Box>
                    <Text fontSize="xl" mb={4} fontWeight="bold">Contact Information</Text>
                    <Text>Phone: (123) 456-7890</Text>
                    <Text>Email: support@martx.com</Text>
                    <Text>Mon-Fri: 9am - 6pm</Text>
                </Box>
            </Flex>
        </Box>
    );
}

export default Footer;
