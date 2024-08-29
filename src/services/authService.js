import axios from 'axios';

// Set the base URL for your backend
const API_URL = 'http://127.0.0.1:8000/auth';

// Login Service: Handles sending the login credentials and receiving the JWT tokens
export const loginService = async (credentials) => {
    try {

        // const payload = {
        //     username: email,  // the API expects 'username' but we pass email
        //     password: password
        // };

        const response = await axios.post(`${API_URL}/jwt/create/`, credentials);
        window.location.href = '/dashboard';
        return response.data; // { access, refresh }
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Login failed');
    }
};

// Refresh Token Service: Handles refreshing the access token
export const refreshTokenService = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
        const response = await axios.post(`${API_URL}/jwt/refresh/`, {
            refresh: refreshToken,
        });
        localStorage.setItem('accessToken', response.data.access); // Update the access token
        return response.data.access;
    } catch (error) {
        throw new Error('Token refresh failed');
    }
};

// Logout Service: Invalidates the refresh token and removes it from storage
export const logoutService = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            await axios.post(`${API_URL}/logout/`, {}, {
                headers: {
                    'Authorization': `Bearer ${refreshToken}`
                }
            });
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    } catch (error) {
        console.error('Logout failed', error.response?.data || error.message);
    }
};

export const signupService = async (userData) => {
    console.log(userData);
    try {
        await axios.post(`${API_URL}/users/`, userData);
        window.location.href = '/login';
        
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Signup failed');
    }
};