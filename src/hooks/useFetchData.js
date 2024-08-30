import { useEffect, useState } from 'react';
import axios from 'axios';

export const useFetchData = (url = '') => {
    const [data, setData] = useState(null); // Initialize as null to better handle the initial state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Add error state to handle errors

    useEffect(() => {
        if (!url) {
            setLoading(false);
            return; // If no URL is provided, don't fetch data
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: response } = await axios.get(url);
                setData(response);
            } catch (err) {
                console.error(err);
                setError(err);
            }
            setLoading(false);
        };

        fetchData();
    }, [url]);

    return {
        data,
        loading,
        error, // Return the error state as well
    };
};
