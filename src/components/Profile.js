import React, { useEffect, useState } from 'react';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    Spinner,
    Textarea,
    useToast,
} from '@chakra-ui/react';
import useUserStore from '../stores/userStore';

const Profile = () => {
    const [editMode, setEditMode] = useState(false);
    const { user, loading, fetchUser, updateUser } = useUserStore();
    const [userData, setUserData] = useState({});
    const toast = useToast();

    const token = localStorage.getItem('access_token');

    useEffect(() => {
        if (!user) {
            fetchUser(token);
        } else {
            setUserData(user);
        }
    }, [user, fetchUser, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleSaveChanges = async () => {
        const success = await updateUser(token, userData);
        if (success) {
            setEditMode(false);
            toast({
                title: 'Profile updated.',
                description: 'Your profile information has been successfully updated.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: 'Update failed.',
                description: 'There was an error updating your profile. Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    if (loading) {
        return <Spinner size="xl" />;
    }

    return (
        <Box maxW="600px" mx="auto" p="6" boxShadow="md" borderRadius="md" bg="white">
            <Heading as="h2" size="lg" textAlign="center" mb="6">
                User Profile
            </Heading>
            <FormControl mb="4">
                <FormLabel>First Name</FormLabel>
                <Input
                    type="text"
                    name="first_name"
                    value={userData.first_name || ''}
                    onChange={handleInputChange}
                    isReadOnly={!editMode}
                />
            </FormControl>
            <FormControl mb="4">
                <FormLabel>Last Name</FormLabel>
                <Input
                    type="text"
                    name="last_name"
                    value={userData.last_name || ''}
                    onChange={handleInputChange}
                    isReadOnly={!editMode}
                />
            </FormControl>
            <FormControl mb="4">
                <FormLabel>Email</FormLabel>
                <Input type="email" value={userData.email || ''} isReadOnly />
            </FormControl>
            <FormControl mb="4">
                <FormLabel>Phone Number</FormLabel>
                <Input
                    type="text"
                    name="phone_number"
                    value={userData.phone_number || ''}
                    onChange={handleInputChange}
                    isReadOnly={!editMode}
                />
            </FormControl>
            <FormControl mb="4">
                <FormLabel>Address</FormLabel>
                <Textarea
                    name="address"
                    value={userData.address || ''}
                    onChange={handleInputChange}
                    isReadOnly={!editMode}
                />
            </FormControl>
            <Box textAlign="center" mt="6">
                {editMode ? (
                    <>
                        <Button colorScheme="blue" mr="4" onClick={handleSaveChanges}>
                            Save Changes
                        </Button>
                        <Button onClick={() => setEditMode(false)}>Cancel</Button>
                    </>
                ) : (
                    <Button colorScheme="teal" onClick={() => setEditMode(true)}>
                        Edit Profile
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default Profile;
