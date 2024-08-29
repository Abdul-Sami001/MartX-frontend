import React from 'react';
import Slider from 'react-slick';
import { Box, Image, Text, Flex } from '@chakra-ui/react';

function FeaturedCategories() {
    // Placeholder data for categories
    const categories = [
        { name: "Men", image: "/category-imgs/category1.jpeg" },
        { name: "Women", image: "/category-imgs/category2.jpeg" },
        { name: "Kids", image: "/category-imgs/category3.jpeg" },
        { name: "Formal", image: "/category-imgs/category4.jpeg" },
        { name: "Casual", image: "/category-imgs/category5.jpeg" },
        { name: "Pumps", image: "/category-imgs/category6.jpeg" },
        { name: "Sports", image: "/category-imgs/category7.jpeg" },
        { name: "Slippers", image: "/category-imgs/category8.jpeg" },
        { name: "Orthopedic", image: "/category-imgs/category9.jpeg" },
    ];

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

    return (
        <Box py={{ base: 4, md: 8 }} px={{ base: 2, md: 4 }}>
            <Slider {...settings}>
                {categories.map((category, index) => (
                    <Flex key={index} direction="column" align="center" justify="center" mx={2}>
                        <Box
                            borderRadius="full"
                            overflow="hidden"
                            width={{ base: "70px", md: "90px", lg: "100px" }}
                            height={{ base: "70px", md: "90px", lg: "100px" }}
                            mb={2}
                            border="2px solid #F47D31"
                            boxShadow="lg"
                        >
                            <Image
                                src={category.image}
                                alt={category.name}
                                width="100%"
                                height="100%"
                                objectFit="cover"
                                transition="transform 0.3s"
                                _hover={{ transform: "scale(1.1)" }}
                            />
                        </Box>
                        <Text fontSize={{ base: "xs", md: "sm", lg: "md" }} fontWeight="bold" color="#0A0E23">
                            {category.name}
                        </Text>
                    </Flex>
                ))}
            </Slider>
        </Box>
    );
}

export default FeaturedCategories;
