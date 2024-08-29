import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Input, Button, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';

const SignupForm = ({ onSubmit, error }) => {
    return (
        <Formik
            initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
            validate={values => {
                const errors = {};
                if (!values.username) errors.username = 'Username is required';
                if (!values.email) errors.email = 'Email is required';
                if (!values.password) errors.password = 'Password is required';
                if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords must match';
                return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
                await onSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <FormControl>
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <Field as={Input} id="username" name="username" placeholder="Username" />
                        <FormErrorMessage><ErrorMessage name="username" /></FormErrorMessage>
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Field as={Input} id="email" name="email" type="email" placeholder="Email" />
                        <FormErrorMessage><ErrorMessage name="email" /></FormErrorMessage>
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Field as={Input} id="password" name="password" type="password" placeholder="Password" />
                        <FormErrorMessage><ErrorMessage name="password" /></FormErrorMessage>
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                        <Field as={Input} id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm Password" />
                        <FormErrorMessage><ErrorMessage name="confirmPassword" /></FormErrorMessage>
                    </FormControl>
                    <Button type="submit" isLoading={isSubmitting} mt={4}>Sign Up</Button>
                    {error && <p>{error}</p>}
                </Form>
            )}
        </Formik>
    );
};

export default SignupForm;
