/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useCurrentUser } from "@/Redux/features/auth/authSlice";
import { useAppSelector } from "@/Redux/features/hook";
import useAxiosPublic from './useAxiosPublic';

const useUser = (email: string | undefined) => {
    const userToken = useAppSelector(useCurrentUser);
    const userEmail = email ? email : userToken?.email;
    const axiosPublic = useAxiosPublic()
    const [user, setUser] = useState(null);
    const [error] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            if (!userEmail) return; // If there's no email, skip the request

            setIsLoading(true);
            try {
                const response = await axiosPublic.get(`/users/${userEmail}`);
                setUser(response?.data.data); // Set user data
            } catch (err) {
                if (err instanceof Error) {
                    console.log(err);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []); // Refetch when userEmail changes
    console.log(user);

    return {
        user,
        isLoading,
        error,
    };
};

export default useUser;
