import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Box, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Text, useColorModeValue,
} from '@chakra-ui/react';
import useAuthStore from '../stores/authStore'; // Import Zustand store

// Validation Schema using Yup
const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password is too short - should be 8 chars minimum.').required('Password is required'),
});

const LoginForm = () => {
    const bgColor = useColorModeValue('white', 'gray.700');
    const { login, error, isAuthenticated } = useAuthStore(); // Access Zustand store actions and state

    // Password Input with integrated Show/Hide functionality
    const PasswordInput = () => {
        const [show, setShow] = useState(false);
        const handleClick = () => setShow(!show);

        return (
            <InputGroup size="md">
                <Field
                    as={Input}
                    pr="4.5rem" // Right padding to make space for the button
                    name="password"
                    type={show ? 'text' : 'password'}
                    placeholder="Enter password"
                    focusBorderColor="teal.400"
                    variant="flushed"
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? 'Hide' : 'Show'}
                    </Button>
                </InputRightElement>
            </InputGroup>
        );
    };

    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={(values, actions) => {
                const credentials = {
                    email: values.email,
                    password: values.password,
                };
                login(credentials); // Call Zustand's login action
                actions.setSubmitting(false);
            }}
        >
            {({ isSubmitting, errors, touched }) => (
                <Form>
                    <Box
                        p={8}
                        maxWidth="400px"
                        borderWidth={1}
                        borderRadius={8}
                        boxShadow="lg"
                        bg={bgColor}
                        m="auto"
                        mt={10}
                    >
                        <FormControl id="email" isInvalid={errors.email && touched.email}>
                            <FormLabel>Email</FormLabel>
                            <Field
                                as={Input}
                                name="email"
                                type="email"
                                variant="flushed"
                                focusBorderColor="teal.400"
                                placeholder="Enter Email"
                            />
                            {errors.email && touched.email && <Text color="red.500">{errors.email}</Text>}
                        </FormControl>

                        <FormControl id="password" mt={4} isInvalid={errors.password && touched.password}>
                            <FormLabel>Password</FormLabel>
                            <PasswordInput />
                            {errors.password && touched.password && <Text color="red.500">{errors.password}</Text>}
                        </FormControl>

                        {error && <Text color="red.500" mt={2}>{error}</Text>}

                        <Button
                            mt={4}
                            colorScheme="teal"
                            isLoading={isSubmitting}
                            loadingText="Submitting"
                            type="submit"
                            width="full"
                            variant="solid"
                        >
                            Login
                        </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;
