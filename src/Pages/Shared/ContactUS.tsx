/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";
import Swal from "sweetalert2";

const ContactUS = () => {
    const [name, setName] = useState("");
    const [sender, setSender] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!name || !sender || !message) {
            Swal.fire("Error", "Please fill in all fields.", "error");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`https://joychandrauday-backend.vercel.app/api/credentials/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    sender,
                    message: `From Student Stationary Website: ${message}`
                }),
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire("Message Sent", "We received your message successfully.", "success");
                setName("");
                setSender("");
                setMessage("");
            } else {
                throw new Error(data.message || "Something went wrong.");
            }
        } catch (error) {
            Swal.fire("Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">Contact Us</h1>
                <p className="text-gray-600 mt-4">
                    We'd love to hear from you! Reach out to us for any inquiries, feedback, or support.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Form */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send Us a Message</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Your Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Your Email</label>
                            <input
                                type="email"
                                value={sender}
                                onChange={(e) => setSender(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Your Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write your message here"
                                className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                rows={5}
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>

                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="bg-gray-100 rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Store Address</h3>
                        <p className="text-gray-600">123 Stationary Lane, Creativity City, AB 12345</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer Support</h3>
                        <p className="text-gray-600">Email: support@stationaryshop.com</p>
                        <p className="text-gray-600">Phone: +1 (123) 456-7890</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Business Hours</h3>
                        <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                        <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Visit Us</h2>
                <div className="w-full h-64 bg-gray-200 rounded-lg shadow-md">
                    <iframe
                        title="Google Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509616!2d144.95373531531823!3d-37.81627917975186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577dfff6a1c5b0!2sVictoria%20State%20Library!5e0!3m2!1sen!2sau!4v1615273177566!5m2!1sen!2sau"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default ContactUS;
