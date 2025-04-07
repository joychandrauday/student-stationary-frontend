import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AdminNewsLetter = () => {
    const [subscribers, setSubscribers] = useState<string[]>([]);
    const [newsletterContent, setNewsletterContent] = useState("");
    const [subject, setSubject] = useState("Exciting Updates!"); // Added subject state
    const [loading, setLoading] = useState(false); // Added loading state

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const response = await fetch(`https://studentstationary-backend.vercel.app/api/v1/newsletter/`);
                const data = await response.json();
                if (data.success) {
                    const emails = data.data.map((subscriber: { email: string }) => subscriber.email);
                    setSubscribers(emails);
                }
            } catch (error) {
                console.error("Error fetching subscription data:", error);
            }
        };
        fetchSubscribers();
    }, []);

    const removeSubscriber = (emailToRemove: string) => {
        const filteredSubscribers = subscribers.filter(sub => sub !== emailToRemove);
        setSubscribers(filteredSubscribers);
        Swal.fire("Removed!", "Subscriber has been removed.", "info");
    };

    const sendNewsletter = async () => {
        if (subscribers.length === 0) {
            Swal.fire("No Subscribers!", "You don't have any subscribers to send emails.", "warning");
            return;
        }
        if (newsletterContent.trim() === "") {
            Swal.fire("Empty Content!", "Please write some content for the newsletter.", "error");
            return;
        }

        setLoading(true); // Set loading state to true while sending the email

        const response = await fetch('https://studentstationary-backend.vercel.app/api/v1/newsletter/send-all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subject,
                body: newsletterContent
            })
        });

        await response.json();
        Swal.fire("Newsletter Sent!", `Your newsletter has been sent to ${subscribers.length} subscribers.`, "success");

        setLoading(false); // Set loading state to false after sending the email
        setNewsletterContent(""); // Reset newsletter content
    };

    return (
        <div className="p-6 text-white min-h-screen space-y-6">
            <header className="mb-6">
                <h1 className="text-3xl font-bold">Admin Newsletter</h1>
                <p className="text-gray-400">Manage newsletter subscribers and send updates</p>
            </header>

            <div className="rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-blue-400 mb-4">Subscribers List</h2>
                {subscribers.length === 0 ? (
                    <p className="text-gray-400">No subscribers yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {subscribers.map((sub, index) => (
                            <li key={index} className="flex justify-between text-black items-center p-3 rounded-md">
                                <span>{sub}</span>
                                <button
                                    onClick={() => removeSubscriber(sub)}
                                    className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-blue-400 mb-4">Send Newsletter</h2>

                {/* Input for dynamic subject */}
                <input
                    type="text"
                    placeholder="Enter newsletter subject..."
                    className="w-full p-3 rounded-md text-black border placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />

                <textarea
                    rows={5}
                    placeholder="Write your newsletter content here..."
                    className="w-full p-3 rounded-md text-black border placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newsletterContent}
                    onChange={(e) => setNewsletterContent(e.target.value)}
                />

                {/* Send button */}
                <button
                    onClick={sendNewsletter}
                    className={`mt-4 px-6 py-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white rounded-md transition-all`}
                    disabled={loading} // Disable button while loading
                >
                    {loading ? "Sending..." : "Send Newsletter"}
                </button>
            </div>
        </div>
    );
};

export default AdminNewsLetter;
