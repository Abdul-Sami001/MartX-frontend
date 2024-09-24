import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Box, Image, Text, Flex, Spinner } from '@chakra-ui/react';
import axios from 'axios';  // Axios for making API requests
import { toast } from 'react-toastify';  // Toast for error handling

function FeaturedCategories() {
    const [categories, setCategories] = useState([]);  // State to store categories from API
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);  // Error state

    // Fetch categories from the API when the component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/store/collections/');
                setCategories(response.data);  // Assuming data is directly the array of categories
                setLoading(false);
            } catch (err) {
                setError('Failed to load categories');
                toast.error('Failed to load categories');  // Show toast on error
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // React Slick Slider settings for responsive behavior
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1280, // Extra Large Devices (Desktops)
                settings: {
                    slidesToShow: 6,
                },
            },
            {
                breakpoint: 1024, // Large Devices (Laptops/Tablets Landscape)
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 768, // Medium Devices (Tablets Portrait)
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 480, // Small Devices (Mobile)
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 360, // Extra Small Devices (Small Mobile)
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };

    // Display loading spinner while fetching categories
    if (loading) {
        return (
            <Flex justify="center" align="center" height="200px">
                <Spinner size="lg" />
            </Flex>
        );
    }

    // Display error message if there's an error
    if (error) {
        return (
            <Flex justify="center" align="center" height="200px">
                <Text color="red.500">{error}</Text>
            </Flex>
        );
    }

    return (
        <Box py={{ base: 4, md: 8 }} px={{ base: 2, md: 4 }}>
            <Slider {...settings}>
                {categories.map((category) => (
                    <Flex key={category.id} direction="column" align="center" justify="center" mx={2}>
                        <Box
                            borderRadius="full"
                            overflow="hidden"
                            width={{ base: "70px", md: "90px", lg: "100px" }}
                            height={{ base: "70px", md: "90px", lg: "100px" }}
                            mb={2}
                            border="2px solid #F47D31"
                            boxShadow="lg"
                        >
                            {/* Placeholder Image - You can replace this with the actual category image if available */}
                            <Image
                                src={`/category-imgs/default-category.jpg`}  // Replace with real image if available in the response
                                alt={category.title}
                                width="100%"
                                height="100%"
                                objectFit="cover"
                                transition="transform 0.3s"
                                _hover={{ transform: "scale(1.1)" }}
                            />
                        </Box>
                        <Text fontSize={{ base: "xs", md: "sm", lg: "md" }} fontWeight="bold" color="#0A0E23">
                            {category.title}
                        </Text>
                    </Flex>
                ))}
            </Slider>
        </Box>
    );
}

export default FeaturedCategories;
