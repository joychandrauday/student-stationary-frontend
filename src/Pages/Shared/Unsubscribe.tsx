/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useLocation } from 'react-router-dom';
const Unsubscribe = () => {
    const location = useLocation();
    const [email, setEmail] = useState("user@3.com"); // Placeholder email; you can replace this dynamically.
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const emailParam = queryParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [location]);
    useEffect(() => {
        Swal.fire({
            title: "Are you sure?",
            text: `Do you really want to unsubscribe from the newsletter?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Unsubscribe",
            cancelButtonText: "No, Stay Subscribed",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                await handleUnsubscribe();
            }
        });
    }, []);

    const handleUnsubscribe = async () => {
        try {
            const response = await fetch(`https://studentstationary-backend.vercel.app/api/v1/newsletter/${email}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (data.success) {
                Swal.fire({
                    title: "Unsubscribed!",
                    text: "You have successfully unsubscribed from the newsletter.",
                    icon: "success",
                    confirmButtonText: "Okay",
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "There was an issue with unsubscribing.",
                    icon: "error",
                    confirmButtonText: "Try Again",
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "An error occurred while unsubscribing.",
                icon: "error",
                confirmButtonText: "Try Again",
            });
            console.error("Error unsubscribing:", error);
        }
    };

    return (
        <div className="p-6 text-center text-white min-h-screen bg-gray-800 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold">Unsubscribe from Newsletter</h1>
            <p className="mt-4 text-gray-400">You are about to unsubscribe from the newsletter.</p>
        </div>
    );
};

export default Unsubscribe;
