/* eslint-disable @typescript-eslint/no-unused-vars */
import { RootState } from "@/Redux/features/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const UserSetting = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        if (user?.email) {
            setEmail(user.email);
        }
    }, [user]);

    useEffect(() => {
        const fetchSubscription = async () => {
            if (!email) return;
            try {
                const response = await fetch(`https://studentstationary-backend.vercel.app/api/v1/newsletter/${email}`);
                const data = await response.json();
                if (data.success) {
                    setIsSubscribed(true);
                }
            } catch (error) {
                console.error("Error fetching subscription data:", error);
            }
        };
        fetchSubscription();
    }, [email]);

    const handleSubscribe = async () => {
        if (!email.trim()) {
            toast.error("Please enter your email!");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("https://studentstationary-backend.vercel.app/api/v1/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                toast.success("Subscribed successfully!");
                setIsSubscribed(true);
            } else if (response.status === 400) {
                toast.error("You are already subscribed!");
            } else {
                toast.error("Subscription failed! Try again.");
            }
        } catch (error) {
            toast.error("Something went wrong! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUnsubscribe = async () => {
        if (!email.trim()) {
            toast.error("Please enter your email!");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`https://studentstationary-backend.vercel.app/api/v1/newsletter/${email}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            await response.json();
            if (response.ok) {
                toast.success("Unsubscribed successfully!");
                setIsSubscribed(false);
            } else {
                toast.error("Failed to unsubscribe! Try again.");
            }
        } catch (error) {
            toast.error("Something went wrong! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-md w-96 mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4">Newsletter Settings</h2>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md mb-4"
            />
            <div className="flex justify-between">
                {isSubscribed ? (
                    <button
                        onClick={handleUnsubscribe}
                        className="bg-red-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Unsubscribe"}
                    </button>
                ) : (
                    <button
                        onClick={handleSubscribe}
                        className="bg-primary-foreground text-white px-4 py-2 rounded-md disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Subscribe"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserSetting;
