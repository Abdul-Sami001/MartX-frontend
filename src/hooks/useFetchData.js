import { useEffect, useState } from 'react';
import axios from 'axios';

export const useFetchData = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data : response } = await axios.get('http://127.0.0.1:8000/store/products/');
                setData(response);
                
            } catch (error) {
                console.error(error)
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    return {
        data,
        loading,
    };
};

