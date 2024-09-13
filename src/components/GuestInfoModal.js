import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';

const GuestInfoModal = ({ isOpen, onClose, handleGuestSubmit }) => {
    const [guestInfo, setGuestInfo] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        country: '',
        postal_code: ''
    });

    // Handle form submission when user clicks "Proceed to Checkout"
    const handleSubmit = () => {
        if (!guestInfo.name || !guestInfo.email || !guestInfo.address || !guestInfo.city || !guestInfo.postal_code) {
            alert('Please fill in all fields.');
            return;
        }
        handleGuestSubmit(guestInfo);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Guest Checkout Information</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel>Full Name</FormLabel>
                        <Input value={guestInfo.name} onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })} />
                    </FormControl>
                    <FormControl isRequired mt={4}>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" value={guestInfo.email} onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })} />
                    </FormControl>
                    <FormControl isRequired mt={4}>
                        <FormLabel>Address</FormLabel>
                        <Input value={guestInfo.address} onChange={(e) => setGuestInfo({ ...guestInfo, address: e.target.value })} />
                    </FormControl>
                    <FormControl isRequired mt={4}>
                        <FormLabel>City</FormLabel>
                        <Input value={guestInfo.city} onChange={(e) => setGuestInfo({ ...guestInfo, city: e.target.value })} />
                    </FormControl>
                    <FormControl isRequired mt={4}>
                        <FormLabel>Country</FormLabel>
                        <Input value={guestInfo.country} onChange={(e) => setGuestInfo({ ...guestInfo, country: e.target.value })} />
                    </FormControl>
                    <FormControl isRequired mt={4}>
                        <FormLabel>Postal Code</FormLabel>
                        <Input value={guestInfo.postal_code} onChange={(e) => setGuestInfo({ ...guestInfo, postal_code: e.target.value })} />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                        Proceed to Checkout
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default GuestInfoModal;
