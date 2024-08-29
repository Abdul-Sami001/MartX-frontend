import React from 'react';
import SignupForm from '../components/SignupForm';
import useSignup from '../hooks/useSignup';

const SignupPage = () => {
    const { signup, error, loading } = useSignup();

    const handleSignup = async (formData) => {
        await signup(formData); // Call the signup function from the hook
    };

    return (
        <div>
            <SignupForm onSubmit={handleSignup} error={error} />
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default SignupPage;
