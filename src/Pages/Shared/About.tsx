
const About = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800">About Us</h1>
                    <p className="text-gray-600 mt-4">
                        Learn more about our story, our mission, and what drives us to bring you the best stationery products.
                    </p>
                </div>

                {/* Our Story Section */}
                <section className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Our Story
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Founded with a passion for creativity and innovation, our mission is to provide the highest quality stationery products for everyone. Whether you're a student, a professional, or an artist, we strive to inspire creativity and productivity through our products.
                            </p>
                        </div>
                        <div>
                            <img
                                src="https://via.placeholder.com/400"
                                alt="Our Story"
                                className="w-full h-auto rounded-lg shadow-md"
                            />
                        </div>
                    </div>
                </section>

                {/* Mission & Vision Section */}
                <section className="mb-12">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                            Our Mission & Vision
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Mission
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    To empower creativity and organization through premium stationery products, ensuring quality and affordability for all.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Vision
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    To become a globally recognized brand for stationery, inspiring innovation and productivity worldwide.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                        Why Choose Us?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                High-Quality Products
                            </h3>
                            <p className="text-gray-600">
                                We ensure the best quality stationery to meet your needs.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Affordable Prices
                            </h3>
                            <p className="text-gray-600">
                                Premium stationery at prices that don't break the bank.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Customer Satisfaction
                            </h3>
                            <p className="text-gray-600">
                                Your happiness is our top priority, always.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-center">
                        What Our Customers Say
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="bg-white text-gray-800 rounded-lg shadow-md p-6">
                            <p className="italic">
                                "Amazing quality! The notebooks are perfect for my projects."
                            </p>
                            <p className="text-sm font-semibold mt-4">- Sarah H.</p>
                        </div>
                        <div className="bg-white text-gray-800 rounded-lg shadow-md p-6">
                            <p className="italic">
                                "Fast delivery and excellent customer service. Highly recommend!"
                            </p>
                            <p className="text-sm font-semibold mt-4">- John D.</p>
                        </div>
                        <div className="bg-white text-gray-800 rounded-lg shadow-md p-6">
                            <p className="italic">
                                "The best stationery products I've ever used. Keep it up!"
                            </p>
                            <p className="text-sm font-semibold mt-4">- Priya S.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
