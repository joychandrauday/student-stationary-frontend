import { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import logo from '../../assets/studentstationarylogowhite.png';
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/features/store";

const Footer = () => {
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
                const response = await fetch(`https://relistshop.vercel.app/api/v1/newsletter/${email}`);
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
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email!");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("https://relistshop.vercel.app/api/v1/newsletter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email }),
            });
            if (response.ok) {
                toast.success("Subscribed successfully!");
                setEmail("");
            } else if (response.status === 400) {
                toast.error("You are already subscribed!");
            } else {
                toast.error("Subscription failed! Try again.");
            }
        } catch (error) {
            console.error("Error subscribing:", error);
            toast.error("Something went wrong! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="min-h-screen bg-primary text-white flex flex-col items-center justify-center p-4">
            {/* Upper Row: Subscribe Newsletter */}
            <div className="w-full py-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
                <p className="mb-6 text-gray-300">
                    Get the latest updates, offers, and stationery trends in your inbox.
                </p>
                <form onSubmit={handleSubmit} className="flex justify-center">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        disabled={isSubscribed}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-4 py-2 w-1/3 text-black focus:outline-none"
                    />
                    <button
                        type="submit"
                        className={`bg-primary-foreground px-6 py-2 transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:border-primary-foreground hover:border hover:border-l-0'}`}
                        disabled={loading || isSubscribed}

                    >
                        {loading ? "Submitting..." : isSubscribed ? "You are already subscribed!!" : "Subscribe"}
                    </button>
                </form>
            </div>

            {/* Lower Row: 4 Column Layout */}
            <div className="container mx-auto flex flex-wrap justify-between px-4 py-12 border-t border-gray-600">
                {/* Logo & Social Links */}
                <div className="w-full md:w-1/4 mb-6 md:mb-0">
                    <img src={logo} className="w-52" alt="Stationery Hub Logo" />
                    <p className="text-gray-400 mt-2">
                        Your one-stop solution for all stationery needs.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <FaFacebook className="text-xl cursor-pointer hover:text-gray-400" />
                        <FaTwitter className="text-xl cursor-pointer hover:text-gray-400" />
                        <FaInstagram className="text-xl cursor-pointer hover:text-gray-400" />
                        <FaLinkedin className="text-xl cursor-pointer hover:text-gray-400" />
                    </div>
                </div>

                {/* Useful Links */}
                <div className="w-full md:w-1/4 mb-6 md:mb-0">
                    <h3 className="text-lg font-semibold">Useful Links</h3>
                    <ul className="mt-3 space-y-2">
                        <li className="hover:text-gray-400 cursor-pointer"><a href="about">About Us</a></li>
                        <li className="hover:text-gray-400 cursor-pointer"><a href="products">Our Services</a></li>
                        <li className="hover:text-gray-400 cursor-pointer"><a href="contact">Contact Us</a></li>
                        <li className="hover:text-gray-400 cursor-pointer"><a href="explore">Explore</a></li>
                    </ul>
                </div>

                {/* Customer Support */}
                <div className="w-full md:w-1/4 mb-6 md:mb-0">
                    <h3 className="text-lg font-semibold">Customer Support</h3>
                    <ul className="mt-3 space-y-2">
                        <li className="hover:text-gray-400 cursor-pointer">Help Center</li>
                        <li className="hover:text-gray-400 cursor-pointer">Return Policy</li>
                        <li className="hover:text-gray-400 cursor-pointer">Shipping Info</li>
                        <li className="hover:text-gray-400 cursor-pointer">Track Order</li>
                    </ul>
                </div>

                {/* Policies */}
                <div className="w-full md:w-1/4">
                    <h3 className="text-lg font-semibold">Policies</h3>
                    <ul className="mt-3 space-y-2">
                        <li className="hover:text-gray-400 cursor-pointer">Privacy Policy</li>
                        <li className="hover:text-gray-400 cursor-pointer">Terms & Conditions</li>
                        <li className="hover:text-gray-400 cursor-pointer">Refund Policy</li>
                        <li className="hover:text-gray-400 cursor-pointer">Cookie Policy</li>
                    </ul>
                </div>
            </div>

            {/* Copyright */}
            <div className="py-4 text-center text-gray-400">
                &copy; {new Date().getFullYear()} Stationery Hub. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
