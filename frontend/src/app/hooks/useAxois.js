// hooks/useAxios.js
import { useState } from 'react';
import axiosInstance from '@/app/utils/axoisInstance';

const useAxios = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = async ({ method = 'GET', endpoint, data = null, headers = {} }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance({
                url: endpoint,
                method,
                data,
                headers,
            });
            setData(response.data);
            return response.data; // Return the response for further chaining
        } catch (err) {
            setError(err.response?.data || err.message);
            throw err; // Rethrow error for external handling if needed
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, sendRequest };
};

export default useAxios;
