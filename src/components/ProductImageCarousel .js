import React, { useState } from 'react';
import { Box, Image, VStack, Grid, GridItem } from '@chakra-ui/react';

const ProductImageCarousel = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images.length > 0 ? images[0].image : 'https://via.placeholder.com/600');

    if (!images || images.length === 0) {
        return <Box>No Image Available</Box>;
    }

    return (
        <Grid
            templateColumns={{ base: '1fr', md: '100px 1fr' }}
            gap={4}
            alignItems="center"
            justifyItems="center"
        >
            {/* Thumbnails on the left for larger screens */}
            <GridItem>
                <VStack spacing={4} display={{ base: 'flex', md: 'block' }}>
                    {images.map((img, index) => (
                        <Image
                            key={index}
                            src={img.image}
                            alt={`Product Thumbnail ${index + 1}`}
                            boxSize={{ base: '80px', md: '100px' }}
                            objectFit="cover"
                            cursor="pointer"
                            onClick={() => setSelectedImage(img.image)}
                            border={selectedImage === img.image ? '2px solid orange' : 'none'}
                            borderRadius="md"
                        />
                    ))}
                </VStack>
            </GridItem>

            {/* Main Image */}
            <GridItem>
                <Box width={{ base: '300px', md: '500px' }} height={{ base: '300px', md: '500px' }}>
                    <Image
                        src={selectedImage}
                        alt="Selected Product Image"
                        boxSize="100%"
                        objectFit="cover"
                        borderRadius="md"
                    />
                </Box>
            </GridItem>
        </Grid>
    );
};

export default ProductImageCarousel;
