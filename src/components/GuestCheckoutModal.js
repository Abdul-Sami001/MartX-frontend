import React from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    FormControl, FormLabel, Input, Button
} from '@chakra-ui/react';

const GuestCheckoutModal = ({ isModalOpen, onModalClose, guestInfo, setGuestInfo, handleGuestCheckout }) => {
    return (
        <Modal isOpen={isModalOpen} onClose={onModalClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Guest Checkout</ModalHeader>
                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                            value={guestInfo.name}
                            onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                        />
                    </FormControl>
                    <FormControl isRequired mt={4}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            value={guestInfo.email}
                            onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                        />
                    </FormControl>
                    <FormControl isRequired mt={4}>
                        <FormLabel>Address</FormLabel>
                        <Input
                            value={guestInfo.address}
                            onChange={(e) => setGuestInfo({ ...guestInfo, address: e.target.value })}
                        />
                    </FormControl>
                    <FormControl isRequired mt={4}>
                        <FormLabel>City</FormLabel>
                        <Input
                            value={guestInfo.city}
                            onChange={(e) => setGuestInfo({ ...guestInfo, city: e.target.value })}
                        />
                    </FormControl>
                    <FormControl isRequired mt={4}>
                        <FormLabel>Country</FormLabel>
                        <Input
                            value={guestInfo.country}
                            onChange={(e) => setGuestInfo({ ...guestInfo, country: e.target.value })}
                        />
                    </FormControl>
                    <FormControl isRequired mt={4}>
                        <FormLabel>Postal Code</FormLabel>
                        <Input
                            value={guestInfo.postal_code}
                            onChange={(e) => setGuestInfo({ ...guestInfo, postal_code: e.target.value })}
                        />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleGuestCheckout}>
                        Proceed to Checkout
                    </Button>
                    <Button variant="ghost" onClick={onModalClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default GuestCheckoutModal;
