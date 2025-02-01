import axios from 'axios';

const useAxiosPublic = () => {
    const axiosInstance = axios.create({
        // baseURL: import.meta.env.API_URL
        // baseURL: 'http://localhost:3000/api/v1'
        baseURL: 'https://studentstationary-backend.vercel.app/api/v1'
    });

    return axiosInstance;
};

export default useAxiosPublic;