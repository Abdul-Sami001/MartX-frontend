import { useState } from 'react';
import { loginService } from '../services/authService';

const useLogin = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async (credentials) => {
        setLoading(true);
        setError(null);

        let newCredentials = {
            username: credentials.email,
            password: credentials.password,
        }
        
        try {
            const data = await loginService(newCredentials);
            localStorage.setItem('accessToken', data.access);  // Store access token
            localStorage.setItem('refreshToken', data.refresh); // Store refresh token
            console.log('Login successful');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { login, error, loading };
};

export default useLogin;
