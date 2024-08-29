import React from 'react';
import { Box, Text, Flex, Avatar } from '@chakra-ui/react';
import Slider from 'react-slick';

function Testimonials() {
    const testimonials = [
        { name: "John Doe", review: "Amazing product quality!", rating: 5, image: "/category-imgs/category1.jpeg" },
        { name: "Jane Smith", review: "Great customer service.", rating: 4, image: "/category-imgs/category1.jpeg" },
        // Add more testimonial objects here...
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
    };

    return (
        <Box p={4} mt={8}>
            <Text fontSize="2xl" mb={4} fontWeight="bold">What Our Customers Say</Text>
            <Slider {...settings}>
                {testimonials.map((testimonial, index) => (
                    <Box key={index} p={4} border="1px solid #e2e8f0" borderRadius="md" mx={2}>
                        <Flex align="center" mb={4}>
                            <Avatar src={testimonial.image} size="md" mr={4} />
                            <Box>
                                <Text fontWeight="bold">{testimonial.name}</Text>
                                <Text color="gray.500">Rating: {testimonial.rating} / 5</Text>
                            </Box>
                        </Flex>
                        <Text>"{testimonial.review}"</Text>
                    </Box>
                ))}
            </Slider>
        </Box>
    );
}

export default Testimonials;
